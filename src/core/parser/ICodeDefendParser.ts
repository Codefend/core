export interface ICodefendParser {
  parse: (code: string, regex: RegExp) => RegExpMatchArray | null;
}
