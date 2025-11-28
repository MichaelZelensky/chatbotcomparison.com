import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { detectPages } from './detect.ts';
import { readJson, type PagesFile } from './types.ts';
import {
  getExistingFileHash,
  writeTextFile,
  getHashOfString,
  ensureDir,
  fileExists,
  deleteFileIfExists
} from './fs-helpers.ts';
import { getAiText } from './openai.ts';
import {
  getComparePrompt,
  getFeaturePrompt,
  getCompareScaffold,
  getFeatureScaffold,
  getIndexListScaffold,
  type CompareGeneratedPayload,
  type FeatureGeneratedPayload
} from './templates.ts';

console.log('limit:', process.env.REQUEST_LIMIT);

const root = process.cwd();
const dryRun = process.env.DRY_RUN === '1';

const rawLimit = process.env.REQUEST_LIMIT || '1';
const parsedLimit = Number.parseInt(rawLimit, 10);
const requestLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 1;

const paths = {
  featureGroups: `${root}/data/feature-groups.json`,
  providers: `${root}/data/providers.json`,
  planValues: `${root}/data/plan-values.json`,
  pages: `${root}/data/pages.json`,
  compareIndex: `${root}/pages/compare/index.vue`,
  featuresIndex: `${root}/pages/features/index.vue`
};

const loadPagesFile = (): PagesFile => readJson<PagesFile>(paths.pages);

const savePagesFile = (pagesFile: PagesFile) => {
  if (dryRun) {
    console.log('[dry-run] pages.json would be updated');
    return;
  }
  console.log('- Writing file data/pages.json');
  writeFileSync(
    paths.pages,
    JSON.stringify(pagesFile, null, 2) + '\n',
    'utf8'
  );
};

const generateContentForPage = async (
  page: PagesFile['pages'][number],
  context: ReturnType<typeof detectPages>
) => {
  if (page.generate === false) {
    console.log(`[skip] generate:false -> ${page.slug}`);
    return '';
  }

  if (dryRun) {
    console.log(`[dry-run] would request AI for ${page.slug}`);
    return '[dry-run] AI output';
  }

  if (page.type === 'compare') {
    const { system, user } = getComparePrompt(
      page,
      context.providers,
      context.planValues
    );
    console.log(`- Sending request to OpenAI for ${page.slug} (type=compare, model=${page.model})`);
    const raw = await getAiText({ model: page.model, system, user });
    const parsed = JSON.parse(raw) as CompareGeneratedPayload;
    return getCompareScaffold(page.title, parsed);
  }

  if (page.type === 'feature') {
    const { system, user } = getFeaturePrompt(page, context.planValues);
    console.log(`- Sending request to OpenAI for ${page.slug} (type=feature, model=${page.model})`);
    const raw = await getAiText({ model: page.model, system, user });
    const parsed = JSON.parse(raw) as FeatureGeneratedPayload;
    return getFeatureScaffold(page.title, parsed);
  }

  return '';
};

const buildIndexes = (pages: PagesFile['pages']) => {
  const existingPages = pages.filter(page => {
    if (page.generate === false) {
      return false;
    }
    const fullPath = `${root}/${page.contentPath}`;
    return fileExists(fullPath);
  });

  const compareItems = existingPages
    .filter(x => x.type === 'compare')
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map(x => ({ href: x.slug, label: x.title }));

  const featuresItems = existingPages
    .filter(x => x.type === 'feature')
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map(x => ({ href: x.slug, label: x.title }));

  return {
    compareIndex: getIndexListScaffold('All comparisons', compareItems),
    featuresIndex: getIndexListScaffold('All features', featuresItems)
  };
};

const writeFileMaybe = (path: string, content: string) => {
  if (dryRun) {
    console.log(`[dry-run] would write: ${path}`);
    return;
  }
  console.log(`- Writing file ${path}`);
  writeTextFile(path, content);
};

const main = async () => {
  const pagesFile = loadPagesFile();

  const context = detectPages({
    featureGroupsPath: paths.featureGroups,
    providersPath: paths.providers,
    planValuesPath: paths.planValues,
    pagesPath: paths.pages,
    defaultModel: pagesFile.defaultModel,
    defaultPromptSet: pagesFile.defaultPromptSet
  });

  console.log(
    `Detected ${context.pages.length} pages (dry-run=${dryRun ? 'yes' : 'no'}; requestLimit=${requestLimit})`
  );

  const updatedPages: PagesFile['pages'] = [];
  let usedRequests = 0;

  for (const page of context.pages) {
    // Hard skip + delete for generate:false
    if (page.generate === false) {
      const fullPath = `${root}/${page.contentPath}`;
      if (fileExists(fullPath)) {
        if (dryRun) {
          console.log(`[dry-run] would delete file ${fullPath} for ${page.slug}`);
        } else {
          console.log(`- Deleting file ${fullPath} for ${page.slug}`);
          deleteFileIfExists(fullPath);
        }
      }
      console.log(`[skip] generate:false -> ${page.slug}`);

      const blockedPage = {
        ...page,
        contentHash: null,
        status: 'missing' as const
      };

      updatedPages.push(blockedPage);
      continue;
    }

    const shouldGenerate = page.status !== 'fresh';

    if (!shouldGenerate) {
      console.log(`[ok] fresh -> ${page.slug}`);
      updatedPages.push(page);
      continue;
    }

    if (usedRequests >= requestLimit) {
      console.log(`[limit] request limit reached, skipping -> ${page.slug}`);
      updatedPages.push(page);
      continue;
    }

    console.log(`[update] outdated -> ${page.slug}`);

    const sfc = await generateContentForPage(page, context);

    // Count logical "requests" even in dry-run, to mirror real behaviour
    usedRequests += 1;

    // Hash of generated file content, only for "identical content" optimisation
    const fileHash = getHashOfString(sfc);
    const existingHash = getExistingFileHash(`${root}/${page.contentPath}`);

    if (!dryRun && existingHash === fileHash) {
      console.log(`[skip] identical content -> ${page.slug}`);

      // Mark as fresh by storing CURRENT dataHash in contentHash
      const stable = {
        ...page,
        contentHash: page.dataHash,
        status: 'fresh' as const
      };

      updatedPages.push(stable);
      continue;
    }

    writeFileMaybe(`${root}/${page.contentPath}`, sfc);

    // Store dataHash as the "generation hash" for freshness comparison
    const next = {
      ...page,
      contentHash: page.dataHash,
      status: 'fresh' as const,
      lastGenAt: new Date().toISOString()
    };

    updatedPages.push(next);
  }

  const nextPagesFile: PagesFile = {
    schemaVersion: context.pagesFileMeta.schemaVersion,
    defaultModel: pagesFile.defaultModel,
    defaultPromptSet: pagesFile.defaultPromptSet,
    pages: updatedPages
  };

  const { compareIndex, featuresIndex } = buildIndexes(
    nextPagesFile.pages
  );

  ensureDir(`${root}/pages/compare`);
  ensureDir(`${root}/pages/features`);

  writeFileMaybe(paths.compareIndex, compareIndex);
  writeFileMaybe(paths.featuresIndex, featuresIndex);

  savePagesFile(nextPagesFile);

  console.log('Done.');
};

main().catch(err => {
  console.error(err);
  process.exit(1);
});
