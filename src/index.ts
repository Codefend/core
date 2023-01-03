import { CodefendMapper } from "./core/mapper/CodeDefendMapper";
import { ICodefendOptions, defaultOptions } from "./core/options/ICodeDefendOptions";
import { CodefendParser } from "./core/parser/CodeDefendParser";
import { CodefendReplacer } from "./core/replacer/CodeDefendReplacer";

export const Codefend = {
  core: {
    parser: new CodefendParser(defaultOptions),
    mapper: new CodefendMapper(defaultOptions),
    replacer: new CodefendReplacer(),
  },
  obfuscate: (code: string, map: Record<string, string> = {}, options?: ICodefendOptions) => {
    const words = Codefend.core.parser.parse(code, options?.regex);
    Codefend.core.mapper.buildMap(words, options?.prefix, map);
    map = Codefend.core.mapper.sortMap(map);
    Codefend.core.mapper.mapPredefinedWords(map, options?.predefinedWords);
    Codefend.core.mapper.mapIgnoredWords(map, options?.ignoredWords);
    const output = Codefend.core.replacer.replace(map, code);
    return output;
  },
};
