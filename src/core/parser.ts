import { IRegexListOption } from "./options";

export function initializeRegex(regexListOption: IRegexListOption) {
  return new RegExp(regexListOption.value, regexListOption.flag);
}

export function parse(options: IParseOptions) {
  const words: IParsedWord[] = [];
  let matches;
  options.regexList.forEach((regexListOption) => {
    matches = options.code.match(regexListOption._regExp ?? initializeRegex(regexListOption));
    if (!matches) return;
    matches.forEach((word: string) => {
      words.push({ value: word, fromRegex: regexListOption.name });
    });
  });
  return words;
}

export interface IParseOptions {
  code: string;
  regexList: IRegexListOption[];
}

export interface IParsedWord {
  value: string;
  fromRegex: string;
}
