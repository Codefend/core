import { ICodefendRegexListOption } from "../options/ICodeDefendOptions";

export interface ICodefendParser {
  parse: (
    code: string,
    regexList: ICodefendRegexListOption[]
  ) => ICodefendParserWord[];
}

export interface ICodefendParserWord {
  value: string;
  fromRegex: string;
}
