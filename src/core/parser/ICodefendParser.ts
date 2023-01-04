import { ICodefendRegexListOption } from "../options/ICodefendOptions";

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
