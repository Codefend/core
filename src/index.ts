import { CodeDefenderMapper } from "./core/mapper/CodeDefenderMapper";
import { ICodeDefenderOptions } from "./core/options/ICodeDefenderOptions";
import { CodeDefenderParser } from "./core/parser/CodeDefenderParser";
import { CodeDefenderReplacer } from "./core/replacer/CodeDefenderReplacer";
import { codeDefenderDefaultOptions } from "./core/utils/Defaults";

export const CodeDefender = {
  core: {
    parser: new CodeDefenderParser(codeDefenderDefaultOptions),
    mapper: new CodeDefenderMapper(codeDefenderDefaultOptions),
    replacer: new CodeDefenderReplacer(),
  },
  obfuscate: (code: string, map: Record<string, string> = {}, options?: ICodeDefenderOptions) => {
    const words = CodeDefender.core.parser.parse(code, options?.regex);
    CodeDefender.core.mapper.buildMap(words, options?.prefix, map);
    map = CodeDefender.core.mapper.sortMap(map);
    CodeDefender.core.mapper.mapPredefinedWords(map, options?.predefinedWords);
    CodeDefender.core.mapper.mapIgnoredWords(map, options?.ignoredWords);
    const output = CodeDefender.core.replacer.replace(map, code);
    return output;
  },
};
