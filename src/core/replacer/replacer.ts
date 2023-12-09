import { IRuntimeOptions } from "../process/runtime.js";

export function replace(options: IReplaceOptions, runtimeOptions: IRuntimeOptions): string {
    const words = Object.keys(runtimeOptions.map);
    if (!words.length) return options.code;

    const regex = new RegExp(words.join("|"), "gi");
    return options.code.replace(regex, (matched) => runtimeOptions.map[matched] ?? "");
}

export interface IReplaceOptions {
    code: string;
}
