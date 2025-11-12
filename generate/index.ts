#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { detectPages } from './detect.ts';
import { readJson, PagesFile } from './types.ts';
import { getExistingFileHash, writeTextFile, getHashOfString, ensureDir } from './fs-helpers.ts';
import { getAiText } from './openai.ts';
import { getComparePrompt, getFeaturePrompt, getCompareScaffold, getFeatureScaffold, getIndexListScaffold } from './templates.ts';

const root = process.cwd();

const paths = {
  featureGroups: `${root}/data/feature-groups.json`,
  providers: `${root}/data/providers.json`,
  planValues: `${root}/data/plan-values.json`,
  pages: `${root}/data/pages.json`,
  compareIndex: `${root}/pages/compare/index.vue`,
  featuresIndex: `${root}/pages/features/index.vue`
};

const loadPagesFile = (): PagesFile => readJson<PagesFile>(paths.pages);

const savePagesFile = (pagesFile: PagesFile) =>
  writeFileSync(paths.pages, JSON.stringify(pagesFile, null, 2) + '\n', 'utf8');

const generateContentForPage = async (page: PagesFile['pages'][number], context: ReturnType<typeof detectPages>) => {
  if (page.generate === false) return '';
  if (page.type === 'compare') {
    const { system, user } = getComparePrompt(page, context.providers, context.planValues);
    const raw = await getAiText({ model: page.model, system, user });
    const sfc = getCompareScaffold(page.title, raw);
    return sfc;
  }
  if (page.type === 'feature') {
    const { system, user } = getFeaturePrompt(page, context.planValues);
    const raw = await getAiText({ model: page.model, system, user });
    const sfc = getFeatureScaffold(page.title, raw);
    return sfc;
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

  const compareIndex = getIndexListScaffold('All comparisons', compareItems);
  const featuresIndex = getIndexListScaffold('All features', featuresItems);
  return { compareIndex, featuresIndex };
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

  const updatedPages = await Promise.all(context.pages.map(async page => {
    const isBlocked = page.generate === false;
    const shouldGenerate = !isBlocked && page.status !== 'fresh';
    if (!shouldGenerate) return page;

    const sfc = await generateContentForPage(page, context);
    const newContentHash = getHashOfString(sfc);
    const existingHash = getExistingFileHash(`${root}/${page.contentPath}`);
    if (existingHash === newContentHash) {
      const stable = { ...page, contentHash: newContentHash, status: 'fresh' as const };
      return stable;
    }
    writeTextFile(`${root}/${page.contentPath}`, sfc);
    const next = { ...page, contentHash: newContentHash, status: 'fresh' as const, lastGenAt: new Date().toISOString() };
    return next;
  }));

  const nextPagesFile: PagesFile = {
    schemaVersion: context.pagesFileMeta.schemaVersion,
    defaultModel: pagesFile.defaultModel,
    defaultPromptSet: pagesFile.defaultPromptSet,
    pages: updatedPages
  };

  const { compareIndex, featuresIndex } = buildIndexes(nextPagesFile.pages);
  ensureDir(`${root}/pages/compare`);
  ensureDir(`${root}/pages/features`);
  writeTextFile(paths.compareIndex, compareIndex);
  writeTextFile(paths.featuresIndex, featuresIndex);

  savePagesFile(nextPagesFile);
};

main().catch(x => {
  console.error(x);
  process.exit(1);
});
