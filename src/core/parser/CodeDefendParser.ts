import { ICodefendOptions } from "../options/ICodeDefendOptions";
import { ICodefendParser } from "./ICodeDefendParser";

export class CodefendParser implements ICodefendParser {
  options: ICodefendOptions | undefined;

  constructor(options: ICodefendOptions) {
    this.setOptions(options);
  }

  setOptions(options: ICodefendOptions) {
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
