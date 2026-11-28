import { IInternalParserOptions } from "../../models/internal.js";
import { IRuntimeOptions, WordEncryptionType } from "../process/runtime.js";

export function replace(options: IReplaceOptions, runtimeOptions: IRuntimeOptions): string {
  if (!Object.keys(runtimeOptions.map).length) return options.code;

  const matches: { index: number; word: string }[] = [];
  const seen = new Set<string>();
  const collectMatches = (regex: RegExp): void => {
    // Clone the expression so replacement does not depend on or change its lastIndex.
    const flags = regex.global ? regex.flags : `${regex.flags}g`;
    for (const match of options.code.matchAll(new RegExp(regex.source, flags))) {
      const word = match[0];
      if (!Object.prototype.hasOwnProperty.call(runtimeOptions.map, word)) continue;
      const index = match.index!;
      const key = `${index}:${word.length}`;
      if (seen.has(key)) continue;
      seen.add(key);
      matches.push({ index, word });
    }
  };

  // Automatic names are eligible only where the parser actually matched them.
  options.parserOptions.regexList.forEach(({ regex }) => collectMatches(regex));

  // Explicit static entries are literal text replacements, including retained mappings.
  const staticWords = Object.keys(runtimeOptions.processed.map).filter(
    (word) => runtimeOptions.processed.map[word]?.type === WordEncryptionType.static,
  );
  if (staticWords.length) {
    const pattern = staticWords
      .sort((left, right) => right.length - left.length)
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    collectMatches(new RegExp(pattern, "g"));
  }

  // Apply original-source spans once, preferring the longest match at each position.
  matches.sort((left, right) => left.index - right.index || right.word.length - left.word.length);
  const output: string[] = [];
  let nextIndex = 0;
  for (const match of matches) {
    if (match.index < nextIndex) continue;
    output.push(options.code.slice(nextIndex, match.index), runtimeOptions.map[match.word] ?? match.word);
    nextIndex = match.index + match.word.length;
  }
  output.push(options.code.slice(nextIndex));
  return output.join("");
}

export type IReplaceOptions = {
  code: string;
  parserOptions: IInternalParserOptions;
};
