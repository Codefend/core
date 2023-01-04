import { CodefendLogger } from "../../logger/CodefendLogger";
import {
  ICodefendOptions,
  ICodefendPredefinedWordOption,
} from "../options/ICodefendOptions";
import { ICodefendParserWord } from "../parser/ICodefendParser";
import { ICodefendMapper } from "./ICodefendMapper";

export class CodefendMapper implements ICodefendMapper {
  options: ICodefendOptions;
  logger: CodefendLogger;
  scope: string;

  constructor(options: ICodefendOptions, logger: CodefendLogger) {
    this.options = options;
    this.logger = logger;
    this.scope = this.constructor.name.replace("Codefend", "");
  }

  setOptions(options: ICodefendOptions) {
    this.options = options;
  }

  buildMap(
    words: ICodefendParserWord[],
    map: Record<string, string>,
    prefix?: string
  ) {
    prefix = prefix ?? this.options.prefix;
    let sequence = Object.keys(map).length;
    words.forEach((word) => {
      if (map[word.value]) return;
      map[word.value] = `${prefix ?? ""}${sequence++}`;
      this.logger.log(this.scope, "INFO", word.value);
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

  mapIgnoredWords(map: Record<string, string>, ignoredWords?: string[]) {
    ignoredWords = ignoredWords ?? this.options.ignoredWords ?? [];
    ignoredWords.forEach((word: string) => {
      map[word] = word;
    });
    return map;
  }

  mapPredefinedWords(
    map: Record<string, string>,
    predefinedWords?: ICodefendPredefinedWordOption[]
  ) {
    predefinedWords = predefinedWords ?? this.options.predefinedWords ?? [];
    predefinedWords.forEach((predefinedWord) => {
      map[predefinedWord.originalWord] = predefinedWord.targetWord;
    });
    return map;
  }
}
