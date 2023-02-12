import { IParsedWord } from "./parser";
import { IRuntimeOptions } from "./runtime";

export function buildMap(options: IBuildMapOptions, runtimeOptions: IRuntimeOptions) {
  let sequence = Object.keys(runtimeOptions.map).length;
  options.words.forEach((word) => {
    if (runtimeOptions.map[word.value]) return;
    runtimeOptions.map[word.value] = `${options.prefix}${sequence++}`;
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
  prefix: string;
  words: IParsedWord[];
}
