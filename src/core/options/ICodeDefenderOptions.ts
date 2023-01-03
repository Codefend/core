export interface ICodeDefenderOptions {
  prefix?: string;
  predefinedWords?: ICodeDefenderPredefinedWordOption[];
  ignoredWords?: string[];
  regex: RegExp;
}

export interface ICodeDefenderPredefinedWordOption {
  originalWord: string;
  targetWord: string;
}
