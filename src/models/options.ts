export interface IOptions {
  generation: IGenerationOptions;
  transformation: ITransformationOptions;
  parser: IParserOptions;
  debug: IDebugOptions;
  __meta?: IMeta;
}

export interface IGenerationOptions {
  inputDir: string;
  outputDir: string;
  ignore?: string[];
}

export interface ITransformationOptions {
  prefix: string;
  static?: IStaticWordTransformationOption[];
  ignore?: string[];
  pool?: string | string[];
}

export interface IDebugOptions {
  stats?: boolean;
}

export interface IParserOptions {
  regexList: IRegexOption[];
}

export interface IRegexOption {
  value: string;
  name: string;
}

export interface IStaticWordTransformationOption {
  from: string;
  to: string;
}

export interface IMeta {
  version: string;
  rcVersion: string;
}
