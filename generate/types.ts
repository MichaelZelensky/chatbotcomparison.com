import { readFileSync } from 'node:fs';

export type PageType = 'compare' | 'feature' | 'provider';

export type CompareRefs = { providers: [string, string]; features: string[] };
export type FeatureRefs = { featureKey: string };
export type ProviderRefs = { provider: string };

export type PageRecord = {
  type: PageType;
  slug: string;
  title: string;
  dataRefs: CompareRefs | FeatureRefs | ProviderRefs;
  version: number;
  generate?: boolean;
  dataHash: string;
  contentHash: string | null;
  lastGenAt: string | null;
  lastGenCommit: string | null;
  promptSet: string;
  model: string;
  status: 'missing' | 'stale' | 'fresh';
  contentPath: string;
};

export type PagesFile = {
  schemaVersion: number;
  defaultModel: string;
  defaultPromptSet: string;
  pages: PageRecord[];
};

export type Provider = {
  name: string;
  slug: string;
  homepage: string;
  plans: { name: string; slug: string }[];
};

export type FeatureGroup = {
  id: string;
  label: string;
  rows: { key: string; label: string; type: 'text' | 'boolean' | 'number'; description?: string }[];
};

export type PlanValues = Record<string, Record<string, Record<string, unknown>>>;

export const readJson = <T>(path: string): T =>
  JSON.parse(readFileSync(path, 'utf8')) as T;
