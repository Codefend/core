import { initializeRegex } from "./parser";
export interface IOptions {
  generationOptions?: IGenerationOptions;
  obfuscationOptions: IObfuscationOptions;
}

export interface IGenerationOptions {
  inputDir: string;
  outputDir: string;
  ignoredFilesInGeneration: string[];
}

export interface IObfuscationOptions {
  stats: boolean;
  prefix: string;
  predefinedWords: IPredefinedWordOption[];
  ignoredWords: string[];
  regexList: IRegexListOption[];
}

export interface IRegexListOption {
  value: string;
  name: string;
  flag: string;
  _regExp?: RegExp;
}

export interface IPredefinedWordOption {
  originalWord: string;
  targetWord: string;
}

export function buildDefaultOptions(): IOptions {
  const options = {
    generationOptions: {
      inputDir: ".",
      outputDir: "codefend-output",
      ignoredFilesInGeneration: [
        "codefend-output",
        ".rc.json",
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
      stats: true,
      prefix: "Ox",
      predefinedWords: [],
      ignoredWords: ["node_modules"],
      regexList: [
        {
          name: "main",
          value: "([a-zA-Z]+(_[a-zA-Z0-9]+)+)",
          flag: "g",
        },
      ],
    },
  } as IOptions;

  options.obfuscationOptions.regexList.forEach((e) => (e._regExp = initializeRegex(e)));

  return options;
}

export function buildObfuscationOptions(options?: IObfuscationOptions) {
  options = options ?? ({} as IObfuscationOptions);
  const defaultOptions = buildDefaultOptions();

  return {
    ...defaultOptions.obfuscationOptions,
    ...options,
  };
}
