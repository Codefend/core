import { ICodefendOptions } from "../options/ICodefendOptions";
import { ICodefendLogger } from "./ICodefendLogger";

export class CodefendLogger implements ICodefendLogger {
  options: ICodefendOptions | undefined;

  constructor(options: ICodefendOptions) {
    this.setOptions(options);
  }

  setOptions(options: ICodefendOptions) {
    this.options = options;
  }

  log(scope: string, type: string, message: unknown) {
    if (!this.options?.debug) return;
    console.log(`Codefend(${scope}):${type}:`, message);
  }
}
