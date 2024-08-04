export { buildDebugOptions, buildParserOptions, buildTransformationOptions } from "./core/options/options";
export { startCLI } from "./cli";
export { buildRuntimeOptions } from "./core/process/runtime";
export { obfuscate } from "./core/process/obfuscate";
export { stats } from "./core/debug/stats";
export type {
  IOptions as ICodefendGlobalOptions,
  IGenerationOptions as ICodefendGenerationOptions,
  ITransformationOptions as ICodefendTransformationOptions,
  IParserOptions as ICodefendParserOptions,
  IDebugOptions as ICodefendDebugOptions,
  IStaticWordTransformationOption as ICodefendStaticWordTransformationOption,
  IParserRegexOption as ICodefendParserRegexOption,
} from "./models/options";

export type {
  IInternalOptions as ICodefendInternalGlobalOptions,
  IInternalDebugOptions as ICodefendInternalDebugOptions,
  IInternalGenerationOptions as ICodefendInternalGenerationOptions,
  IInternalParserOptions as ICodefendInternalParserOptions,
  IInternalTransformationOptions as ICodefendInternalTransformationOptions,
} from "./models/internal";
