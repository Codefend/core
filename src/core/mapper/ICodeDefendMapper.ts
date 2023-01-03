import { ICodefendPredefinedWordOption } from "../options/ICodeDefendOptions";
export interface ICodefendMapper {
  buildMap: (words: RegExpMatchArray | null, prefix?: string, map?: Record<string, string>) => Record<string, string>;
  sortMap: (map: Record<string, string>) => void;
  mapIgnoredWords: (map: Record<string, string>, ignoredWords: string[]) => Record<string, string>;
  mapPredefinedWords: (map: Record<string, string>, predefinedWords: ICodefendPredefinedWordOption[]) => Record<string, string>;
}
