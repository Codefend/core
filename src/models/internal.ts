export interface IInternalOptions {
  generation: IInternalGenerationOptions;
  transformation: IInternalTransformationOptions;
  parser: IInternalParserOptions;
  debug: IInternalDebugOptions;
}

export interface IInternalGenerationOptions {
  inputDir: string;
  outputDir: string;
  ignore: string[];
}

export interface IInternalTransformationOptions {
  prefix: string;
  static: IInternalStaticWordTransformationOption[];
  ignore: string[];
  pool: Set<string>;
}

export interface IInternalDebugOptions {
  stats: boolean;
}

export interface IInternalParserOptions {
  regexList: IInternalRegexOption[];
}

export interface IInternalRegexOption {
  name: string;
  regex: RegExp;
}

export interface IInternalStaticWordTransformationOption {
  from: string;
  to: string;
}
