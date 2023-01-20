import { ICodefendRegexListOption } from "../options/ICodefendOptions";
import { ICodefendParser, ICodefendParserWord } from "./ICodefendParser";

export class CodefendParser implements ICodefendParser {
  initializeRegex(regexListOption: ICodefendRegexListOption) {
    return new RegExp(regexListOption.value, regexListOption.flag);
  }

  parse(code: string, regexList: ICodefendRegexListOption[]) {
    const words: ICodefendParserWord[] = [];
    let match;
    regexList.forEach((regexListOption) => {
      match = code.match(regexListOption._regExp ?? this.initializeRegex(regexListOption));
      if (!match) return;
      match.forEach((word: string) => {
        words.push({ value: word, fromRegex: regexListOption.name });
      });
    });
    return words;
  }
}
