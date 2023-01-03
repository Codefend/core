export interface ICodefendParser {
  parse: (code: string, regexList?: RegExp[]) => ICodefendParserWord[];
}

export interface ICodefendParserWord {
  value: string;
  regexIndex: number;
}
