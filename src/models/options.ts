import { IParserNames } from "./types";

export type IOptions = {
  generation: IGenerationOptions;
  transformation?: ITransformationOptions;
  parser?: IParserOptions;
  debug?: IDebugOptions;
  __meta?: IMeta;
};

export type IGenerationOptions = {
  inputDir: string;
  outputDir: string;
  ignore?: string[];
};

export type ITransformationOptions = {
  prefix?: string;
  static?: IStaticWordTransformationOption[];
  ignore?: string[];
  pool?: string | string[];
};

export type IDebugOptions = {
  stats?: boolean;
  ignoredWarnings?: IDebugIgnoredWarningsOption;
};

export type IParserOptions = {
  name: IParserNames;
  regexList?: IParserRegexOption[];
};

export type IParserRegexOption = {
  value: string;
  name: string;
};

export type IStaticWordTransformationOption = {
  from: string;
  to: string;
};

export type IMeta = {
  projectName: string;
  rc: {
    version: string;
    generatedBy: string;
    generatedAt: string;
  };
};

export type IDebugIgnoredWarningsOption = "all" | string[];
