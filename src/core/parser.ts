import { IInternalParserOptions } from "../models/internal";

export function parse(options: IParseOptions) {
  const words: IParsedWord[] = [];
  let matches;
  options.parserOptions.regexList.forEach((regexListOption) => {
    matches = options.code.match(regexListOption.regex);
    if (!matches) return;
    matches.forEach((word: string) => {
      words.push({ value: word, fromRegex: regexListOption.name });
    });
  });
  return words;
}

export interface IParseOptions {
  code: string;
  parserOptions: IInternalParserOptions;
}

export interface IParsedWord {
  value: string;
  fromRegex: string;
}
