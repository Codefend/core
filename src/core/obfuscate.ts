import { mapIgnoredWords } from "./ignored";
import { buildMap, sortMap } from "./mapper";
import { buildDefaultOptions, IOptions, IPredefinedWordOption, IRegexListOption } from "./options";
import { parse } from "./parser";
import { mapPredefinedWords } from "./predefined";
import { replace } from "./replacer";
import { IRuntimeOptions } from "./runtime";

export function obfuscate(code: string, options: IObfuscateOptions, runtimeOptions: IRuntimeOptions) {
  const words = parse({ code: code, regexList: options.regexList });

  buildMap({ words: words, prefix: options.prefix }, runtimeOptions);

  sortMap(runtimeOptions);

  mapPredefinedWords({ predefinedWords: options.predefinedWords }, runtimeOptions);

  mapIgnoredWords({ ignoredWords: options.ignoredWords }, runtimeOptions);

  const output = replace({ code: code }, runtimeOptions);

  return output;
}

export function buildObfuscateOptions(options: IOptions) {
  const defaultOptions = buildDefaultOptions();

  options = {
    ...defaultOptions,
    ...options,
  };

  return {
    debug: options.debug,
    prefix: options.obfuscationOptions.prefix,
    predefinedWords: options.obfuscationOptions.predefinedWords,
    ignoredWords: options.obfuscationOptions.ignoredWords,
    regexList: options.obfuscationOptions.regexList,
  } as IObfuscateOptions;
}

export interface IObfuscateOptions {
  debug: boolean;
  prefix: string;
  predefinedWords: IPredefinedWordOption[];
  ignoredWords: string[];
  regexList: IRegexListOption[];
}
