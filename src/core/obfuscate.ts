import { IInternalParserOptions, IInternalTransformationOptions } from "../models/internal";
import { buildMap, sortMap } from "./mapper";
import { parse } from "./parser";
import { replace } from "./replacer";
import { IRuntimeOptions } from "./runtime";
import { mapDefaultWords } from "./transformation/default";
import { mapIgnoredWords } from "./transformation/ignore";
import { mapPoolWords } from "./transformation/pool";
import { mapStaticWords } from "./transformation/static";

export function obfuscate(
  code: string,
  transformationOptions: IInternalTransformationOptions,
  parserOptions: IInternalParserOptions,
  runtimeOptions: IRuntimeOptions
) {
  const words = parse({ code: code, parserOptions: parserOptions });

  buildMap({ words: words }, runtimeOptions);

  sortMap(runtimeOptions);

  mapStaticWords({ static: transformationOptions.static }, runtimeOptions);

  mapIgnoredWords({ ignore: transformationOptions.ignore }, runtimeOptions);

  mapPoolWords({ prefix: transformationOptions.prefix, pool: transformationOptions.pool }, runtimeOptions);

  mapDefaultWords({ prefix: transformationOptions.prefix }, runtimeOptions);

  return replace({ code: code }, runtimeOptions);
}
