export interface IRuntimeOptions {
  map: Record<string, string>;
  processed: {
    ignoredWords: Set<string>;
    predefinedWords: Set<string>;
  };
}

export function buildRuntimeOptions(): IRuntimeOptions {
  return {
    map: {},
    processed: {
      ignoredWords: new Set(),
      predefinedWords: new Set(),
    },
  };
}
