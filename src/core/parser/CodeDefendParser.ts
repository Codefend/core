import { ICodefendOptions } from "../options/ICodeDefendOptions";
import { ICodefendParser, ICodefendParserWord } from "./ICodeDefendParser";

export class CodefendParser implements ICodefendParser {
  options: ICodefendOptions | undefined;

  constructor(options: ICodefendOptions) {
    this.setOptions(options);
  }

  setOptions(options: ICodefendOptions) {
    this.options = options;
  }

  parse(code: string, regexList?: RegExp[]) {
    regexList = regexList ?? this.options?.regexList;
    if (!regexList) {
      throw new Error("Code Defender: regexList required for parser");
    }
    const words: ICodefendParserWord[] = [];
    let match;
    let index = 0;
    regexList.forEach((regex) => {
      index++;
      match = code.match(regex);
      if (!match) return;
      match.forEach((word: string) => {
        words.push({ value: word, regexIndex: index });
      });
    });
    return words;
  }
}
