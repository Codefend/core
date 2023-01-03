import { ICodefendReplacer } from "./ICodeDefendReplacer";

export class CodefendReplacer implements ICodefendReplacer {
  replace(code: string, map: Record<string, string>) {
    const words = Object.keys(map);
    if (!words.length) return code;

    const regex = new RegExp(words.join("|"), "gi");
    return code.replace(regex, (matched) => map[matched]);
  }
}
