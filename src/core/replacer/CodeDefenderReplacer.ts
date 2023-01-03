import { ICodeDefenderReplacer } from "./ICodeDefenderReplacer";

export class CodeDefenderReplacer implements ICodeDefenderReplacer {
  replace(map: Record<string, string>, code: string) {
    const words = Object.keys(map);
    if (!words.length) return code;

    const regex = new RegExp(words.join("|"), "gi");
    return code.replace(regex, (matched) => map[matched]);
  }
}
