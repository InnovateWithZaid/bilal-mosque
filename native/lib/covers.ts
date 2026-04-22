const BUILT_IN_COVER_KEYS = [
  "placeholder:azure-dawn",
  "placeholder:marble-courtyard",
  "placeholder:sunlit-minaret",
  "placeholder:blue-hour-domes",
] as const;

export type BuiltInCoverKey = (typeof BUILT_IN_COVER_KEYS)[number];

export function getBuiltInMosqueCoverKey(index: number): BuiltInCoverKey {
  return BUILT_IN_COVER_KEYS[index % BUILT_IN_COVER_KEYS.length];
}

export function isBuiltInMosqueCover(uri?: string): uri is BuiltInCoverKey {
  return Boolean(uri && BUILT_IN_COVER_KEYS.includes(uri as BuiltInCoverKey));
}
