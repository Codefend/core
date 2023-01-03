import { ICodeDefenderOptions, ICodeDefenderPredefinedWordOption } from "../options/ICodeDefenderOptions";
import { ICodeDefenderMapper } from "./ICodeDefenderMapper";

export class CodeDefenderMapper implements ICodeDefenderMapper {
  options: ICodeDefenderOptions | undefined;

  constructor(options: ICodeDefenderOptions) {
    this.setOptions(options);
  }

  setOptions(options: ICodeDefenderOptions) {
    this.options = options;
  }

  buildMap(words: RegExpMatchArray | null, prefix?: string, map?: Record<string, string>) {
    map = map ?? {};
    if (!words) return map;
    prefix = prefix ?? this.options?.prefix;
    let sequence = Object.keys(map).length;
    words.forEach((word: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (map[word]) return;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      map[word] = `${prefix ?? ""}${sequence++}`;
    });
    return map;
  }
  sortMap(map: Record<string, string>) {
    return Object.keys(map)
      .sort((a, b) => {
        return b.length - a.length;
      })
      .reduce((obj: Record<string, string>, key: string) => {
        obj[key] = map[key];
        return obj;
      }, {});
  }
  mapIgnoredWords(map: Record<string, string>, ignoredWords?: string[]) {
    ignoredWords = ignoredWords ?? this.options?.ignoredWords ?? [];
    ignoredWords.forEach((word: string) => {
      map[word] = word;
    });
    return map;
  }
  mapPredefinedWords(map: Record<string, string>, predefinedWords?: ICodeDefenderPredefinedWordOption[]) {
    predefinedWords = predefinedWords ?? this.options?.predefinedWords ?? [];
    predefinedWords.forEach((predefinedWord) => {
      map[predefinedWord.originalWord] = predefinedWord.targetWord;
    });
    return map;
  }
}
