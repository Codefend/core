import { IInternalParserOptions } from "../../models/internal.js";
import { IRuntimeOptions } from "../process/runtime.js";
import {
  applyReplacementMatches,
  findParserMatches,
  findStaticMatches,
  sortAndDeduplicateMatches,
} from "./replacerUtils.js";

export function replace(options: IReplaceOptions, runtimeOptions: IRuntimeOptions): string {
  if (!Object.keys(runtimeOptions.map).length) return options.code;

  const parserMatches = findParserMatches(options.code, options.parserOptions, runtimeOptions.map);
  const staticMatches = findStaticMatches(options.code, runtimeOptions);
  const matches = sortAndDeduplicateMatches([...parserMatches, ...staticMatches]);

  return applyReplacementMatches(options.code, matches, runtimeOptions.map);
}

export type IReplaceOptions = {
  code: string;
  parserOptions: IInternalParserOptions;
};
