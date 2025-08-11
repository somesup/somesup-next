export type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never;

const SECTIONS = {
  politics: { id: 1, name: '정치' },
  economy: { id: 2, name: '경제' },
  society: { id: 3, name: '사회' },
  culture: { id: 4, name: '문화' },
  tech: { id: 5, name: '기술' },
  world: { id: 6, name: '세계' },
} as const;
export type SectionType = keyof typeof SECTIONS;
export type SectionNameType = (typeof SECTIONS)[SectionType]['name'];
export type SectionPreference = Record<SectionType, number>;

export const sectionMappingId = Object.fromEntries(
  Object.entries(SECTIONS).map(([key, value]) => [key, value.id]),
) as Record<SectionType, number>;
export const sectionMappingName = Object.fromEntries(
  Object.entries(SECTIONS).map(([key, value]) => [key, value.name]),
) as Record<SectionType, string>;
export const sectionLabels = Object.entries(SECTIONS).reduce((acc, [label, { id }]) => {
  acc[id - 1] = label;
  return acc;
}, Array(6).fill('')) as SectionType[];
export const sectionNames = Object.values(SECTIONS).reduce((acc, { id, name }) => {
  acc[id - 1] = name;
  return acc;
}, Array(6).fill('')) as SectionNameType[];
