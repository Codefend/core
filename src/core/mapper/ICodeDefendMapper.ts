import { ICodefendPredefinedWordOption } from "../options/ICodeDefendOptions";
import { ICodefendParserWord } from "../parser/ICodeDefendParser";
export interface ICodefendMapper {
  buildMap: (
    words: ICodefendParserWord[],
    map: Record<string, string>,
    prefix?: string
  ) => Record<string, string>;
  sortMap: (map: Record<string, string>) => void;
  mapIgnoredWords: (
    map: Record<string, string>,
    ignoredWords: string[]
  ) => Record<string, string>;
  mapPredefinedWords: (
    map: Record<string, string>,
    predefinedWords: ICodefendPredefinedWordOption[]
  ) => Record<string, string>;
}
