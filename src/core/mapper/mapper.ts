import { IParsedWord } from "../parser/parser.js";
import { IRuntimeOptions, WordEncryptionType } from "../process/runtime.js";

export function buildMap(options: IBuildMapOptions, runtimeOptions: IRuntimeOptions): void {
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
export function sortMap(runtimeOptions: IRuntimeOptions): void {
  runtimeOptions.map = Object.keys(runtimeOptions.map)
    .sort((a, b) => {
      return b.length - a.length;
    })
    .reduce((obj: Record<string, string>, key: string) => {
      obj[key] = runtimeOptions.map[key] ?? "";
      return obj;
    }, {});
}

export type IBuildMapOptions = {
  words: IParsedWord[];
};
