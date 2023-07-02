import { IParsedWord } from "./parser";
import { IRuntimeOptions, WordEncryptionType } from "./runtime";

export function buildMap(options: IBuildMapOptions, runtimeOptions: IRuntimeOptions) {
  options.words.forEach((word) => {
    if (runtimeOptions.map[word.value]) {
      runtimeOptions.processed.map[word.value].count++;
      return;
    }
    runtimeOptions.map[word.value] = "";
    runtimeOptions.processed.map[word.value] = {
      count: 1,
      target: "",
      type: WordEncryptionType.default,
    };
  });
}
export function sortMap(runtimeOptions: IRuntimeOptions) {
  runtimeOptions.map = Object.keys(runtimeOptions.map)
    .sort((a, b) => {
      return b.length - a.length;
    })
    .reduce((obj: Record<string, string>, key: string) => {
      obj[key] = runtimeOptions.map[key];
      return obj;
    }, {});
}

export interface IBuildMapOptions {
  words: IParsedWord[];
}
