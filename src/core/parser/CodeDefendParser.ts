import {
  ICodefendOptions,
  ICodefendRegexListOption,
} from "../options/ICodeDefendOptions";
import { ICodefendParser, ICodefendParserWord } from "./ICodeDefendParser";

export class CodefendParser implements ICodefendParser {
  options: ICodefendOptions | undefined;

  constructor(options: ICodefendOptions) {
    this.setOptions(options);
  }

  setOptions(options: ICodefendOptions) {
    this.options = options;
  }

  parse(code: string, regexList?: ICodefendRegexListOption[]) {
    regexList = regexList ?? this.options?.regexList;
    if (!regexList) {
      throw new Error("Code Defender: regexList required for parser");
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
