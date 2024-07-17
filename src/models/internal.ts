export type IInternalOptions = {
  generation: IInternalGenerationOptions;
  transformation: IInternalTransformationOptions;
  parser: IInternalParserOptions;
  debug: IInternalDebugOptions;
};

export type IInternalGenerationOptions = {
  inputDir: string;
  outputDir: string;
  ignore: string[];
};

export type IInternalTransformationOptions = {
  prefix: string;
  static: IInternalStaticWordTransformationOption[];
  ignore: string[];
  pool: string[];
};

export type IInternalDebugOptions = {
  stats: boolean;
};

export type IInternalResponse<T> = {
  error?: {
    errorCode: string;
    errorDescription: string;
  };
  data?: T;
};

export type IInternalParserOptions = {
  name: string;
  regexList: IInternalRegexOption[];
};

export type IInternalRegexOption = {
  name: string;
  regex: RegExp;
};

export type IInternalStaticWordTransformationOption = {
  from: string;
  to: string;
};
