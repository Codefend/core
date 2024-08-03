import { IInternalParserOptions } from "../../models/internal.js";

export function parse(options: IParseOptions): IParsedWord[] {
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

export type IParseOptions = {
  code: string;
  parserOptions: IInternalParserOptions;
};

export type IParsedWord = {
  value: string;
  fromRegex: string;
};
