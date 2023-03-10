import { mapIgnoredWords } from "./ignored";
import { buildMap, sortMap } from "./mapper";
import { IObfuscationOptions } from "./options";
import { parse } from "./parser";
import { mapPredefinedWords } from "./predefined";
import { replace } from "./replacer";
import { IRuntimeOptions } from "./runtime";

export function obfuscate(code: string, options: IObfuscationOptions, runtimeOptions: IRuntimeOptions) {
  const words = parse({ code: code, regexList: options.regexList });

  buildMap({ words: words, prefix: options.prefix }, runtimeOptions);

  sortMap(runtimeOptions);

  mapPredefinedWords({ predefinedWords: options.predefinedWords }, runtimeOptions);

  mapIgnoredWords({ ignoredWords: options.ignoredWords }, runtimeOptions);

  const output = replace({ code: code }, runtimeOptions);

  return output;
}
