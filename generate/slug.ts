export const getCompareSlug = (a: string, b: string): string => {
  const sorted = [a, b].map(x => x.trim()).sort((x, y) => x.localeCompare(y));
  return `/compare/${sorted[0]}-vs-${sorted[1]}`;
};

export const getFeatureSlug = (featureKey: string): string =>
  `/features/${featureKey}`;
