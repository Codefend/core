import { IRuntimeOptions, WordEncryptionType } from "./runtime";

export function mapIgnoredWords(options: IMapIgnoredWordsOptions, runtimeOptions: IRuntimeOptions) {
  options.ignoredWords.forEach((word: string) => {
    runtimeOptions.map[word] = word;
    if (word in runtimeOptions.processed.map) {
      runtimeOptions.processed.map[word].type = WordEncryptionType.ignored;
    } else {
      runtimeOptions.processed.map[word] = {
        count: 0,
        target: word,
        type: WordEncryptionType.ignored,
      };
    }
  });
}

export interface IMapIgnoredWordsOptions {
  ignoredWords: string[];
}
