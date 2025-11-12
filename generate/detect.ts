import { readJson, FeatureGroup, Provider, PlanValues, PagesFile, PageRecord } from './types.ts';
import { getCompareSlug, getFeatureSlug } from './slug.ts';
import { getHashOfString } from './fs-helpers.ts';

type DetectInputs = {
  featureGroupsPath: string;
  providersPath: string;
  planValuesPath: string;
  pagesPath: string;
  defaultModel: string;
  defaultPromptSet: string;
};

export const getDesiredComparePages = (providers: Provider[]): PageRecord[] => {
  const slugs = providers.map(x => x.slug);
  const pairs = slugs.flatMap((x, i) => slugs.slice(i + 1).map(y => [x, y] as [string, string]));
  const pages = pairs.map(pair => {
    const slug = getCompareSlug(pair[0], pair[1]);
    const title = `${pair[0]} vs ${pair[1]}`.replace(/\b\w/g, x => x.toUpperCase());
    const contentPath = `pages${slug}.vue`;
    const dataRefs = { providers: pair, features: [] };
    const record: PageRecord = {
      type: 'compare',
      slug,
      title,
      dataRefs,
      version: 1,
      dataHash: '',
      contentHash: null,
      lastGenAt: null,
      lastGenCommit: null,
      promptSet: 'v1',
      model: 'gpt-4o-mini',
      status: 'missing',
      contentPath
    };
    return record;
  });
  return pages;
};

export const getDesiredFeaturePages = (featureGroups: FeatureGroup[]): PageRecord[] => {
  const featureRows = featureGroups.flatMap(g => g.rows);
  const pages = featureRows.map(row => {
    const slug = getFeatureSlug(row.key);
    const title = row.label;
    const contentPath = `pages${slug}.vue`;
    const dataRefs = { featureKey: row.key };
    const record: PageRecord = {
      type: 'feature',
      slug,
      title,
      dataRefs,
      version: 1,
      dataHash: '',
      contentHash: null,
      lastGenAt: null,
      lastGenCommit: null,
      promptSet: 'v1',
      model: 'gpt-4o-mini',
      status: 'missing',
      contentPath
    };
    return record;
  });
  return pages;
};

const getDataSliceForCompare = (pair: [string, string], providers: Provider[], planValues: PlanValues) => {
  const pick = (p: string) => ({ provider: p, plans: planValues[p] || {} });
  return { a: pick(pair[0]), b: pick(pair[1]), providersMeta: providers.filter(x => pair.includes(x.slug)) };
};

const getDataSliceForFeature = (featureKey: string, planValues: PlanValues) => {
  const values = Object.entries(planValues).map(([provider, plans]) => {
    const plansWithFeature = Object.entries(plans).map(([plan, attrs]) => [plan, (attrs as Record<string, unknown>)[featureKey]]);
    return { provider, plans: Object.fromEntries(plansWithFeature) };
  });
  return { featureKey, values };
};

const getDataHashForPage = (page: PageRecord, providers: Provider[], planValues: PlanValues): string => {
  if (page.type === 'compare') {
    const refs = page.dataRefs as { providers: [string, string]; features: string[] };
    const data = getDataSliceForCompare(refs.providers, providers, planValues);
    return getHashOfString(JSON.stringify(data));
  }
  if (page.type === 'feature') {
    const refs = page.dataRefs as { featureKey: string };
    const data = getDataSliceForFeature(refs.featureKey, planValues);
    return getHashOfString(JSON.stringify(data));
  }
  return '';
};

const mergeDesiredWithCurrent = (desired: PageRecord[], pagesFile: PagesFile, defaultModel: string, defaultPromptSet: string): PageRecord[] => {
  const mapCurrent = new Map(pagesFile.pages.map(x => [x.slug, x]));
  const merged = desired.map(d => {
    const curr = mapCurrent.get(d.slug);
    const base = { ...d, model: defaultModel, promptSet: defaultPromptSet };
    return curr ? { ...base, ...curr, model: curr.model || defaultModel, promptSet: curr.promptSet || defaultPromptSet } : base;
  });
  return merged;
};

export const detectPages = (inputs: DetectInputs) => {
  const featureGroups = readJson<FeatureGroup[]>(inputs.featureGroupsPath);
  const providers = readJson<Provider[]>(inputs.providersPath);
  const planValues = readJson<PlanValues>(inputs.planValuesPath);
  const pagesFile = readJson<PagesFile>(inputs.pagesPath);

  const desired = [
    ...getDesiredComparePages(providers),
    ...getDesiredFeaturePages(featureGroups)
  ];

  const merged = mergeDesiredWithCurrent(desired, pagesFile, inputs.defaultModel, inputs.defaultPromptSet);
  const recalculated = merged.map(page => ({ ...page, dataHash: getDataHashForPage(page, providers, planValues) }));

  const final = recalculated.map(page => {
    const status = page.contentHash ? (page.dataHash === page.contentHash ? 'fresh' : 'stale') : 'missing';
    return { ...page, status };
  });

  return { pages: final, featureGroups, providers, planValues, pagesFileMeta: { schemaVersion: pagesFile.schemaVersion } };
};
