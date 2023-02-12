import { IRuntimeOptions } from "./runtime";

export function mapIgnoredWords(options: IMapIgnoredWordsOptions, runtimeOptions: IRuntimeOptions) {
  options.ignoredWords.forEach((word: string) => {
    runtimeOptions.map[word] = word;
    runtimeOptions.processed.ignoredWords.add(word);
  });
}

export interface IMapIgnoredWordsOptions {
  ignoredWords: string[];
}
