import { IRuntimeOptions, WordEncryptionType } from "../process/runtime.js";

export function mapPoolWords(options: IMapCustomGeneratedWordsOptions, runtimeOptions: IRuntimeOptions) {
  let sequence = 0;
  let word;
  for (const key in runtimeOptions.processed.map) {
    if (runtimeOptions.processed.map[key]!.type == WordEncryptionType.default) {
      word = generateWord(sequence, options);
      if (!word) continue;
      runtimeOptions.map[key] = word;
      runtimeOptions.processed.map[key]!.target = word;
      runtimeOptions.processed.map[key]!.type = WordEncryptionType.pool;
      sequence++;
    }
  }
}

export type IMapCustomGeneratedWordsOptions = {
  prefix: string;
  pool: string[];
};

function generateWord(sequence: number, options: IMapCustomGeneratedWordsOptions) {
  if (options.pool.length <= sequence) {
    return null;
  }
  let index = 0;
  for (const entry of options.pool) {
    if (index === sequence) return entry;
    index++;
  }
}
