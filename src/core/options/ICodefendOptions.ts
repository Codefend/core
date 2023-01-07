export interface ICodefendOptions {
  generationOptions?: ICodefendGenerationOptions;
  obfuscationOptions: ICodefendObfuscationOptions;
  debug?: boolean;
}

export interface ICodefendGenerationOptions {
  inputDir: string;
  outputDir: string;
  ignoredFilesInGeneration: string[];
}

export interface ICodefendObfuscationOptions {
  prefix?: string;
  predefinedWords?: ICodefendPredefinedWordOption[];
  ignoredWords?: string[];
  regexList?: ICodefendRegexListOption[];
}

export interface ICodefendPredefinedWordOption {
  originalWord: string;
  targetWord: string;
}

export interface ICodefendRegexListOption {
  value: string;
  name: string;
  flag: string;
  _regExp?: RegExp;
}

export const defaultOptions: ICodefendOptions = {
  debug: true,
  generationOptions: {
    inputDir: ".",
    outputDir: "codefend-output",
    ignoredFilesInGeneration: [
      "codefend-output",
      ".codefendrc.json",
      "node_modules",
      ".git",
      ".github",
      ".gitignore",
      ".vscode",
      "build",
      "dist",
      "README.md",
    ],
  },

  obfuscationOptions: {
    prefix: "Ox",
    predefinedWords: [],
    ignoredWords: ["node_modules"],
    regexList: [
      {
        name: "main",
        value: "([a-zA-Z]+(_[a-zA-Z0-9]+)+)",
        flag: "g",
      },
      {
        name: "file",
        value: "((cmp|lib)+(-[a-zA-Z]+)+)",
        flag: "g",
      },
    ],
  },
};
