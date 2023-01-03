import { ICodeDefenderOptions } from "../options/ICodeDefenderOptions";
import { ICodeDefenderParser } from "./ICodeDefenderParser";

export class CodeDefenderParser implements ICodeDefenderParser {
  options: ICodeDefenderOptions | undefined;

  constructor(options: ICodeDefenderOptions) {
    this.setOptions(options);
  }

  setOptions(options: ICodeDefenderOptions) {
    this.options = options;
  }

  parse(code: string, regex?: RegExp) {
    regex = regex ?? this.options?.regex;
    if (!regex) {
      throw new Error("Code Defender: regex required for parser");
    }
    return code.match(regex);
  }
}
