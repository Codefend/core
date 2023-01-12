import { logger } from "../..";
import {
  IBuildMapOptions,
  ICodefendPredefinedWordOption,
} from "../options/ICodefendOptions";
import { ICodefendParserWord } from "../parser/ICodefendParser";
import { ICodefendMapper } from "./ICodefendMapper";

export class CodefendMapper implements ICodefendMapper {
  buildMap(
    words: ICodefendParserWord[],
    map: Record<string, string>,
    options: IBuildMapOptions
  ) {
    let sequence = Object.keys(map).length;
    words.forEach((word) => {
      if (map[word.value]) return;
      map[word.value] = `${options.prefix}${sequence++}`;
      logger.debug(
        "Codefend",
        `${word.value} --> ${map[word.value]}`,
        options.debug
      );
    });
    return map;
  }

  sortMap(map: Record<string, string>) {
    return Object.keys(map)
      .sort((a, b) => {
        return b.length - a.length;
      })
      .reduce((obj: Record<string, string>, key: string) => {
        obj[key] = map[key];
        return obj;
      }, {});
  }

  mapIgnoredWords(map: Record<string, string>, ignoredWords: string[]) {
    ignoredWords.forEach((word: string) => {
      map[word] = word;
    });
    return map;
  }

  mapPredefinedWords(
    map: Record<string, string>,
    predefinedWords: ICodefendPredefinedWordOption[]
  ) {
    predefinedWords.forEach((predefinedWord) => {
      map[predefinedWord.originalWord] = predefinedWord.targetWord;
    });
    return map;
  }
}
