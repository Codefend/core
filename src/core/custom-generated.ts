import { IRuntimeOptions, WordEncryptionType } from "./runtime";

export function mapCustomGeneratedWords(options: IMapCustomGeneratedWordsOptions, runtimeOptions: IRuntimeOptions) {
  let sequence = 0;
  let target;
  for (const key in runtimeOptions.processed.map) {
    if (runtimeOptions.processed.map[key].type == WordEncryptionType.default) {
      target = generateWord(sequence, options);
      runtimeOptions.map[key] = target;
      runtimeOptions.processed.map[key].target = target;
      sequence++;
    }
  }
}

export interface IMapCustomGeneratedWordsOptions {
  prefix: string;
  customGeneratedWords: string[];
}

function generateWord(sequence: number, options: IMapCustomGeneratedWordsOptions) {
  if (options.customGeneratedWords.length > sequence) {
    return options.customGeneratedWords[sequence];
  }
  return `${options.prefix}${sequence}`;
}
