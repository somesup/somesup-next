export type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never;

export const sectionMappingId = { politics: 1, economy: 2, society: 3, culture: 4, tech: 5, world: 6 } as const;
export type SectionType = keyof typeof sectionMappingId;
export type SectionPreference = Record<SectionType, number>;
