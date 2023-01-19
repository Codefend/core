import { logger } from "../..";
import { ICodefendRuntimeOptions } from "../options/CodefendRuntimeOptions";
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
          options.debug,
          logger.info
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
    options: IMapIgnoredWordsOptions,
    runtimeOptions: ICodefendRuntimeOptions
  ) {
    ignoredWords.forEach((word: string) => {
      if (map[word] && !runtimeOptions.processed.ignoredWords.has(word)) {
        logger.debug(
          "Codefend",
          `${word} (Ignored word)`,
          options.debug,
          logger.warning
        );
      }
      map[word] = word;
      runtimeOptions.processed.ignoredWords.add(word);
    });
    return map;
  }

  mapPredefinedWords(
    map: Record<string, string>,
    predefinedWords: ICodefendPredefinedWordOption[],
    options: IMapPredefinedWordsOptions,
    runtimeOptions: ICodefendRuntimeOptions
  ) {
    predefinedWords.forEach((predefinedWord) => {
      if (
        map[predefinedWord.originalWord] &&
        !runtimeOptions.processed.predefinedWords.has(
          predefinedWord.originalWord
        )
      ) {
        logger.debug(
          "Codefend",
          `${predefinedWord.originalWord} --> ${predefinedWord.targetWord} (Predefined word)`,
          options.debug,
          logger.warning
        );
      }
      map[predefinedWord.originalWord] = predefinedWord.targetWord;
      runtimeOptions.processed.predefinedWords.add(predefinedWord.originalWord);
    });
    return map;
  }
}
