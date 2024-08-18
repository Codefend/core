import { IRuntimeOptions, WordEncryptionType } from "../process/runtime.js";
import Table from "cli-table3";

export type IStatsOptions = {
  stats: boolean;
};

export function stats(options: IStatsOptions, runtimeOptions: IRuntimeOptions): void {
  if (!options.stats) {
    return;
  }

  const table = new Table({
    head: ["Transformation", "From", "To", "Count"],
    colWidths: [17, 35, 35, 10],
  });

  for (const key in runtimeOptions.processed.map) {
    const item = runtimeOptions.processed.map[key];
    const count = item?.count || 0;
    switch (item?.type) {
      case WordEncryptionType.ignore:
        table.push(["Ignored", key, `${key}`, count]);
        break;
      case WordEncryptionType.static:
        table.push(["Static", key, `${item.target}`, count]);
        break;
      case WordEncryptionType.pool:
        table.push(["Pool", key, `${item.target}`, count]);
        break;
      case WordEncryptionType.default:
      case null:
      case undefined:
        table.push(["Prefix", key, `${item?.target || ""}`, count]);
        break;
      default:
        console.warn(`Unknown type for key ${key}`);
    }
  }

  console.log("Obfuscation stats:");
  console.log(table.toString());
  console.log("");
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
