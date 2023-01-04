import { ICodefendOptions } from "../core/options/ICodefendOptions";
import { ICodefendLogger } from "./ICodefendLogger";

export class CodefendLogger implements ICodefendLogger {
  options: ICodefendOptions;

  constructor(options: ICodefendOptions) {
    this.options = options;
  }

  setOptions(options: ICodefendOptions) {
    this.options = options;
  }

  log(scope: string, type: string, message: unknown) {
    if (!this.options.debug) return;
    console.log(`Codefend(${scope}):${type}:`, message);
  }
}
