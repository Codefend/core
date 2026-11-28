import { IInternalParserOptions } from "../../models/internal.js";
import { IRuntimeOptions, WordEncryptionType } from "../process/runtime.js";

// Locations always refer to the original source, before any replacements are applied.
type IReplacementMatch = {
  startIndex: number;
  originalText: string;
};

export function findParserMatches(
  code: string,
  parserOptions: IInternalParserOptions,
  replacements: Record<string, string>,
): IReplacementMatch[] {
  return parserOptions.regexList.flatMap(({ regex }) => findMappedMatches(code, regex, replacements));
}

export function findStaticMatches(code: string, runtimeOptions: IRuntimeOptions): IReplacementMatch[] {
  const staticWords = Object.keys(runtimeOptions.processed.map).filter(
    (word) => runtimeOptions.processed.map[word]?.type === WordEncryptionType.static,
  );
  if (!staticWords.length) return [];

  const pattern = staticWords
    .sort((left, right) => right.length - left.length)
    .map(escapeRegexLiteral)
    .join("|");

  return findMappedMatches(code, new RegExp(pattern, "g"), runtimeOptions.map);
}

export function sortAndDeduplicateMatches(matches: IReplacementMatch[]): IReplacementMatch[] {
  const seenLocations = new Set<string>();
  const uniqueMatches = matches.filter(({ startIndex, originalText }) => {
    const location = `${startIndex}:${originalText.length}`;
    if (seenLocations.has(location)) return false;
    seenLocations.add(location);
    return true;
  });

  // At the same position, match the longer text before its shorter prefix.
  return uniqueMatches.sort(
    (left, right) => left.startIndex - right.startIndex || right.originalText.length - left.originalText.length,
  );
}

export function applyReplacementMatches(
  code: string,
  matches: IReplacementMatch[],
  replacements: Record<string, string>,
): string {
  const outputParts: string[] = [];
  let nextSourceIndex = 0;

  for (const { startIndex, originalText } of matches) {
    // A longer match may already have consumed this part of the original source.
    if (startIndex < nextSourceIndex) continue;
    outputParts.push(code.slice(nextSourceIndex, startIndex), replacements[originalText] ?? originalText);
    nextSourceIndex = startIndex + originalText.length;
  }

  outputParts.push(code.slice(nextSourceIndex));
  return outputParts.join("");
}

function findMappedMatches(code: string, regex: RegExp, replacements: Record<string, string>): IReplacementMatch[] {
  // Use a fresh regex so the caller's lastIndex is neither read nor changed.
  const flags = regex.global ? regex.flags : `${regex.flags}g`;
  const matches: IReplacementMatch[] = [];

  for (const match of code.matchAll(new RegExp(regex.source, flags))) {
    const originalText = match[0];
    if (!Object.prototype.hasOwnProperty.call(replacements, originalText)) continue;
    matches.push({ startIndex: match.index!, originalText });
  }

  return matches;
}

function escapeRegexLiteral(text: string): string {
  // For example, a.b must match a literal dot rather than any character.
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
