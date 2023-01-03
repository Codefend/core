import { CodefendMapper } from "./core/mapper/CodeDefendMapper";
import {
  ICodefendOptions,
  defaultOptions,
} from "./core/options/ICodeDefendOptions";
import { CodefendParser } from "./core/parser/CodeDefendParser";
import { CodefendReplacer } from "./core/replacer/CodeDefendReplacer";

export const CodefendCore = {
  parser: new CodefendParser(defaultOptions),
  mapper: new CodefendMapper(defaultOptions),
  replacer: new CodefendReplacer(),
};

export function obfuscate(
  code: string,
  map: Record<string, string> = {},
  options?: ICodefendOptions
) {
  const words = CodefendCore.parser.parse(code, options?.regexList);
  CodefendCore.mapper.buildMap(words, map, options?.prefix);
  map = CodefendCore.mapper.sortMap(map);
  CodefendCore.mapper.mapPredefinedWords(map, options?.predefinedWords);
  CodefendCore.mapper.mapIgnoredWords(map, options?.ignoredWords);
  const output = CodefendCore.replacer.replace(map, code);
  return output;
}
