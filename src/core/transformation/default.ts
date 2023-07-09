import { IRuntimeOptions, WordEncryptionType } from "../runtime";

export function mapDefaultWords(options: IMapDefaultWordOptions, runtimeOptions: IRuntimeOptions) {
  let sequence = 0;
  let word;
  for (const key in runtimeOptions.processed.map) {
    if (runtimeOptions.processed.map[key].type == WordEncryptionType.default) {
      word = generateWord(sequence, options);
      if (!word) continue;
      runtimeOptions.map[key] = word;
      runtimeOptions.processed.map[key].target = word;
      sequence++;
    }
  }
}

export interface IMapDefaultWordOptions {
  prefix: string;
}

function generateWord(sequence: number, options: IMapDefaultWordOptions) {
  return `${options.prefix}${sequence}`;
}
