import { IRuntimeOptions, WordEncryptionType } from "../process/runtime.js";

export type IStatsOptions = {
  stats: boolean;
};

export function stats(options: IStatsOptions, runtimeOptions: IRuntimeOptions): void {
  if (!options.stats) {
    return;
  }
  console.warn(`Obfuscation stats:`);
  for (const key in runtimeOptions.processed.map) {
    if (runtimeOptions.processed.map[key]?.type === WordEncryptionType.ignore) {
      console.warn("Ignored", `${key} -> ${key} ${getCountLabel(runtimeOptions.processed.map[key]?.count)}`);
    }
  }

  for (const key in runtimeOptions.processed.map) {
    if (runtimeOptions.processed.map[key]?.type === WordEncryptionType.static) {
      console.warn(
        "Static",
        `${key} -> ${runtimeOptions.processed.map[key]?.target} ${getCountLabel(runtimeOptions.processed.map[key]?.count)}`,
      );
    }
  }

  for (const key in runtimeOptions.processed.map) {
    if (runtimeOptions.processed.map[key]?.type === WordEncryptionType.pool) {
      console.warn(
        "Pool",
        `${key} -> ${runtimeOptions.processed.map[key]?.target} ${getCountLabel(runtimeOptions.processed.map[key]?.count)}`,
      );
    }
  }

  for (const key in runtimeOptions.processed.map) {
    if (
      runtimeOptions.processed.map[key]?.type == null ||
      runtimeOptions.processed.map[key]!.type == WordEncryptionType.default
    ) {
      console.warn(
        "Encrypted",
        `${key} -> ${runtimeOptions.processed.map[key]?.target} ${getCountLabel(runtimeOptions.processed.map[key]?.count)}`,
      );
    }
  }
  console.log("");
}

function getCountLabel(count: number): string {
  return `(${count} time${count == 1 ? "" : "s"})`;
}

export function getObfuscatedWordsCount(runtimeOptions: IRuntimeOptions): number {
  let ret = Object.keys(runtimeOptions.processed.map).length;

  for (const key in runtimeOptions.processed.map) {
    if (runtimeOptions.processed.map[key].count == 0) {
      ret--;
    }
  }
  return ret;
}
