#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { detectPages } from './detect.ts';
import { readJson, PagesFile } from './types.ts';
import {
  getExistingFileHash,
  writeTextFile,
  getHashOfString,
  ensureDir
} from './fs-helpers.ts';
import { getAiText } from './openai.ts';
import {
  getComparePrompt,
  getFeaturePrompt,
  getCompareScaffold,
  getFeatureScaffold,
  getIndexListScaffold
} from './templates.ts';

const root = process.cwd();
const dryRun = process.env.DRY_RUN === '1';

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
    console.log(`[skip] generate:false → ${page.slug}`);
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
    const raw = await getAiText({ model: page.model, system, user });
    return getCompareScaffold(page.title, raw);
  }

  if (page.type === 'feature') {
    const { system, user } = getFeaturePrompt(page, context.planValues);
    const raw = await getAiText({ model: page.model, system, user });
    return getFeatureScaffold(page.title, raw);
  }

  return '';
};

const buildIndexes = (pages: PagesFile['pages']) => {
  const compareItems = pages
    .filter(x => x.generate !== false)
    .filter(x => x.type === 'compare')
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map(x => ({ href: x.slug, label: x.title }));

  const featuresItems = pages
    .filter(x => x.generate !== false)
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
    `Detected ${context.pages.length} pages (dry-run=${dryRun ? 'yes' : 'no'})`
  );

  const updatedPages = await Promise.all(
    context.pages.map(async page => {
      const isBlocked = page.generate === false;
      const shouldGenerate = !isBlocked && page.status !== 'fresh';

      if (!shouldGenerate) {
        console.log(`[ok] fresh → ${page.slug}`);
        return page;
      }

      console.log(`[update] outdated → ${page.slug}`);

      const sfc = await generateContentForPage(page, context);

      const newHash = getHashOfString(sfc);
      const existingHash = getExistingFileHash(`${root}/${page.contentPath}`);

      if (!dryRun && existingHash === newHash) {
        console.log(`[skip] identical content → ${page.slug}`);
        const stable = { ...page, contentHash: newHash, status: 'fresh' as const };
        return stable;
      }

      writeFileMaybe(`${root}/${page.contentPath}`, sfc);

      const next = {
        ...page,
        contentHash: newHash,
        status: 'fresh' as const,
        lastGenAt: new Date().toISOString()
      };

      return next;
    })
  );

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
