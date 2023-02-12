import { IPredefinedWordOption } from "./options";
import { IRuntimeOptions, WordEncryptionType } from "./runtime";

export function mapPredefinedWords(options: IMapPredefinedWords, runtimeOptions: IRuntimeOptions) {
  options.predefinedWords.forEach((predefinedWord) => {
    runtimeOptions.map[predefinedWord.originalWord] = predefinedWord.targetWord;

    if (predefinedWord.originalWord in runtimeOptions.processed.map) {
      runtimeOptions.processed.map[predefinedWord.originalWord].target = predefinedWord.targetWord;
      runtimeOptions.processed.map[predefinedWord.originalWord].type = WordEncryptionType.predefined;
    } else {
      runtimeOptions.processed.map[predefinedWord.originalWord] = {
        count: 0,
        target: predefinedWord.targetWord,
        type: WordEncryptionType.predefined,
      };
    }
  });
}

export interface IMapPredefinedWords {
  predefinedWords: IPredefinedWordOption[];
}
