import { ICodeDefenderPredefinedWordOption } from "../options/ICodeDefenderOptions";
export interface ICodeDefenderMapper {
  buildMap: (words: RegExpMatchArray | null, prefix?: string, map?: Record<string, string>) => Record<string, string>;
  sortMap: (map: Record<string, string>) => void;
  mapIgnoredWords: (map: Record<string, string>, ignoredWords: string[]) => Record<string, string>;
  mapPredefinedWords: (map: Record<string, string>, predefinedWords: ICodeDefenderPredefinedWordOption[]) => Record<string, string>;
}
