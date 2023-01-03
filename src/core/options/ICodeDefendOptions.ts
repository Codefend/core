export interface ICodefendOptions {
  prefix?: string;
  predefinedWords?: ICodefendPredefinedWordOption[];
  ignoredWords?: string[];
  regexList: RegExp[];
}

export interface ICodefendPredefinedWordOption {
  originalWord: string;
  targetWord: string;
}

export const defaultOptions: ICodefendOptions = {
  prefix: "Ox",
  predefinedWords: [],
  ignoredWords: [],
  regexList: [/([a-zA-Z]+(_[a-zA-Z0-9]+)+)/g, /((cmp|lib)+(-[a-zA-Z]+)+)/g],
};
