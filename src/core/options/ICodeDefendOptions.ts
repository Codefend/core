export interface ICodefendOptions {
  prefix?: string;
  predefinedWords?: ICodefendPredefinedWordOption[];
  ignoredWords?: string[];
  regex: RegExp;
}

export interface ICodefendPredefinedWordOption {
  originalWord: string;
  targetWord: string;
}

export const defaultOptions: ICodefendOptions = {
  prefix: "Ox",
  predefinedWords: [],
  ignoredWords: [],
  regex: /([a-zA-Z]+(_[a-zA-Z0-9]+)+)/g,
};
