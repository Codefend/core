import { log } from "../index";
import { IRuntimeOptions, WordEncryptionType } from "./runtime";

export function stats(runtimeOptions: IRuntimeOptions) {
  log.info("Codefend", "Obfuscation Stats:");
  for (const key in runtimeOptions.processed.map) {
    if (runtimeOptions.processed.map[key].type === WordEncryptionType.ignored) {
      log.warning("Ignored", `${key} -> ${key} (${runtimeOptions.processed.map[key].count} times)`);
    }
  }

  for (const key in runtimeOptions.processed.map) {
    if (runtimeOptions.processed.map[key].type === WordEncryptionType.predefined) {
      log.warning(
        "Predefined",
        `${key} -> ${runtimeOptions.processed.map[key].target} (${runtimeOptions.processed.map[key].count} times)`
      );
    }
  }

  for (const key in runtimeOptions.processed.map) {
    if (!runtimeOptions.processed.map[key].type) {
      log.info(
        "Encrypted",
        `${key} -> ${runtimeOptions.processed.map[key].target} (${runtimeOptions.processed.map[key].count} times)`
      );
    }
  }
}
