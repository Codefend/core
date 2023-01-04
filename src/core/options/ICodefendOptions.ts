export interface ICodefendOptions {
  prefix?: string;
  predefinedWords?: ICodefendPredefinedWordOption[];
  ignoredWords?: string[];
  regexList?: ICodefendRegexListOption[];
  debug?: boolean;
}

export interface ICodefendPredefinedWordOption {
  originalWord: string;
  targetWord: string;
}

export interface ICodefendRegexListOption {
  value: RegExp;
  name: string;
}

export const defaultOptions: ICodefendOptions = {
  prefix: "Ox",
  predefinedWords: [],
  ignoredWords: [],
  regexList: [
    {
      name: "main",
      value: /([a-zA-Z]+(_[a-zA-Z0-9]+)+)/g,
    },
    {
      name: "file",
      value: /((cmp|lib)+(-[a-zA-Z]+)+)/g,
    },
  ],
  debug: true,
};
