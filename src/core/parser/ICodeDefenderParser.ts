export interface ICodeDefenderParser {
  parse: (code: string, regex: RegExp) => RegExpMatchArray | null;
}
