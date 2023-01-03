import { ICodefendOptions } from "../options/ICodeDefendOptions";

export const defaultOptions: ICodefendOptions = {
  prefix: "Ox",
  predefinedWords: [],
  ignoredWords: [],
  regex: /([a-zA-Z]+(_[a-zA-Z0-9]+)+)/g,
};
