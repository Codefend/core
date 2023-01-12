import { ICodefendRegexListOption } from "./../options/ICodefendOptions";

export interface ICodefendParser {
  parse: (
    code: string,
    regexList: ICodefendRegexListOption[]
  ) => ICodefendParserWord[];

  initializeRegex(regexList: ICodefendRegexListOption): RegExp;
}

export interface ICodefendParserWord {
  value: string;
  fromRegex: string;
}
