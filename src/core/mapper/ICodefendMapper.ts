import { ICodefendRuntimeOptions } from "../options/CodefendRuntimeOptions";
import {
  IBuildMapOptions,
  ICodefendPredefinedWordOption,
  IMapIgnoredWordsOptions,
  IMapPredefinedWordsOptions,
} from "../options/ICodefendOptions";
import { ICodefendParserWord } from "../parser/ICodefendParser";
export interface ICodefendMapper {
  buildMap: (
    words: ICodefendParserWord[],
    map: Record<string, string>,
    options: IBuildMapOptions
  ) => Record<string, string>;
  sortMap: (map: Record<string, string>) => Record<string, string>;
  mapIgnoredWords: (
    map: Record<string, string>,
    ignoredWords: string[],
    options: IMapIgnoredWordsOptions,
    runtimeOptions: ICodefendRuntimeOptions
  ) => Record<string, string>;
  mapPredefinedWords: (
    map: Record<string, string>,
    predefinedWords: ICodefendPredefinedWordOption[],
    options: IMapPredefinedWordsOptions,
    runtimeOptions: ICodefendRuntimeOptions
  ) => Record<string, string>;
}
