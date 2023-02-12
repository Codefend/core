import { IPredefinedWordOption } from "./options";
import { IRuntimeOptions } from "./runtime";

export function mapPredefinedWords(options: IMapPredefinedWords, runtimeOptions: IRuntimeOptions) {
  options.predefinedWords.forEach((predefinedWord) => {
    runtimeOptions.map[predefinedWord.originalWord] = predefinedWord.targetWord;
    runtimeOptions.processed.predefinedWords.add(predefinedWord.originalWord);
  });
}

export interface IMapPredefinedWords {
  predefinedWords: IPredefinedWordOption[];
}
