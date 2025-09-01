export const toTitle = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

export const normalizePair = (a: string, b: string) => {
  const [x, y] = [a.toLowerCase(), b.toLowerCase()].sort();
  return { a: x, b: y };
};
