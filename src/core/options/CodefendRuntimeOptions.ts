export interface ICodefendRuntimeOptions {
  processed: {
    ignoredWords: Set<string>;
    predefinedWords: Set<string>;
  };
}

export function createRuntimeOptions(): ICodefendRuntimeOptions {
  return {
    processed: {
      ignoredWords: new Set(),
      predefinedWords: new Set(),
    },
  };
}
