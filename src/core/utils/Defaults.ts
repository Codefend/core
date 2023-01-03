import { ICodeDefenderOptions } from "../options/ICodeDefenderOptions";

export const codeDefenderDefaultOptions: ICodeDefenderOptions = {
  prefix: "Ox",
  predefinedWords: [],
  ignoredWords: [],
  regex: /([a-zA-Z]+(_[a-zA-Z0-9]+)+)/g,
};
