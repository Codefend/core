import { CodefendLogger } from "../../logger/CodefendLogger";
import { ICodefendReplacer } from "./ICodefendReplacer";

export class CodefendReplacer implements ICodefendReplacer {
  logger: CodefendLogger;
  constructor(logger: CodefendLogger) {
    this.logger = logger;
  }

  replace(code: string, map: Record<string, string>) {
    const words = Object.keys(map);
    if (!words.length) return code;

    const regex = new RegExp(words.join("|"), "gi");
    return code.replace(regex, (matched) => map[matched]);
  }
}
