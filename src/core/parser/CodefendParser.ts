import { CodefendLogger } from "../../logger/CodefendLogger";
import {
  ICodefendOptions,
  ICodefendRegexListOption,
} from "../options/ICodefendOptions";
import { ICodefendParser, ICodefendParserWord } from "./ICodefendParser";

export class CodefendParser implements ICodefendParser {
  options: ICodefendOptions;
  logger: CodefendLogger;

  constructor(options: ICodefendOptions, logger: CodefendLogger) {
    this.options = options;
    this.logger = logger;
  }

  setOptions(options: ICodefendOptions) {
    this.options = options;
  }

  parse(code: string, regexList?: ICodefendRegexListOption[]) {
    regexList = regexList ?? this.options.regexList;
    if (!regexList) {
      throw new Error("Codefend: regexList required for parser");
    }
    const words: ICodefendParserWord[] = [];
    let match;
    regexList.forEach((regex) => {
      match = code.match(regex.value);
      if (!match) return;
      match.forEach((word: string) => {
        words.push({ value: word, fromRegex: regex.name });
      });
    });
    return words;
  }
}
