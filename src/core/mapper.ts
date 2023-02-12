import { IParsedWord } from "./parser";
import { IRuntimeOptions } from "./runtime";

export function buildMap(options: IBuildMapOptions, runtimeOptions: IRuntimeOptions) {
  let sequence = Object.keys(runtimeOptions.map).length;
  options.words.forEach((word) => {
    if (runtimeOptions.map[word.value]) {
      runtimeOptions.processed.map[word.value].count++;
      return;
    }
    const target = `${options.prefix}${sequence++}`;
    runtimeOptions.map[word.value] = target;
    runtimeOptions.processed.map[word.value] = {
      count: 1,
      target: target,
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
  prefix: string;
  words: IParsedWord[];
}
