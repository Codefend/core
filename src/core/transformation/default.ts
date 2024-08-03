import { IRuntimeOptions, WordEncryptionType } from "../process/runtime.js";

export function mapDefaultWords(options: IMapDefaultWordOptions, runtimeOptions: IRuntimeOptions): void {
  let sequence = 0;
  let word;
  for (const key in runtimeOptions.processed.map) {
    if (runtimeOptions.processed.map[key]!.type == WordEncryptionType.default) {
      word = generateWord(sequence, options);
      if (!word) continue;
      runtimeOptions.map[key] = word;
      runtimeOptions.processed.map[key]!.target = word;
      sequence++;
    }
  }
}

export type IMapDefaultWordOptions = {
  prefix: string;
};

function generateWord(sequence: number, options: IMapDefaultWordOptions): string {
  return `${options.prefix}${sequence}`;
}
