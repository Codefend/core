import { logger } from "../..";
import {
  IBuildMapOptions,
  ICodefendPredefinedWordOption,
  IMapIgnoredWordsOptions,
  IMapPredefinedWordsOptions,
} from "../options/ICodefendOptions";
import { ICodefendParserWord } from "../parser/ICodefendParser";
import { ICodefendMapper } from "./ICodefendMapper";

export class CodefendMapper implements ICodefendMapper {
  buildMap(
    words: ICodefendParserWord[],
    map: Record<string, string>,
    options: IBuildMapOptions
  ) {
    const reserved = [
      ...(options.ignoredWords ?? []),
      ...(options.predefinedWords?.map((word) => word.originalWord) ?? []),
    ];
    let sequence = Object.keys(map).length;
    words.forEach((word) => {
      if (map[word.value]) return;
      map[word.value] = `${options.prefix}${sequence++}`;

      if (!reserved.includes(word.value))
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

  mapIgnoredWords(
    map: Record<string, string>,
    ignoredWords: string[],
    options: IMapIgnoredWordsOptions
  ) {
    ignoredWords.forEach((word: string) => {
      if (map[word]) {
        logger.debug("Codefend", `${word} (Ignored word)`, options.debug);
      }
      map[word] = word;
    });
    return map;
  }

  mapPredefinedWords(
    map: Record<string, string>,
    predefinedWords: ICodefendPredefinedWordOption[],
    options: IMapPredefinedWordsOptions
  ) {
    predefinedWords.forEach((predefinedWord) => {
      if (map[predefinedWord.originalWord]) {
        logger.debug(
          "Codefend",
          `${map[predefinedWord.originalWord]} --> ${
            predefinedWord.targetWord
          } (Predefined word)`,
          options.debug
        );
      }
      map[predefinedWord.originalWord] = predefinedWord.targetWord;
    });
    return map;
  }
}
