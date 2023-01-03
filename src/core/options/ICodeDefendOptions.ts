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
