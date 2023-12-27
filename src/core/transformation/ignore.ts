import { IRuntimeOptions, WordEncryptionType } from "../process/runtime.js";

export function mapIgnoredWords(options: IMapIgnoredWordsOptions, runtimeOptions: IRuntimeOptions) {
    options.ignore.forEach((word: string) => {
        runtimeOptions.map[word] = word;
        if (word in runtimeOptions.processed.map) {
            runtimeOptions.processed.map[word]!.type = WordEncryptionType.ignore;
        } else {
            runtimeOptions.processed.map[word] = {
                count: 0,
                target: word,
                type: WordEncryptionType.ignore,
            };
        }
    });
}

export interface IMapIgnoredWordsOptions {
    ignore: string[];
}
