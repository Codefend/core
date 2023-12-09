import { IRuntimeOptions, WordEncryptionType } from "../process/runtime.js";

export function stats(options: IStatsOptions, runtimeOptions: IRuntimeOptions) {
    if (!options.stats) {
        console.warn("Obfuscation Stats disabled");
        return;
    }
    console.warn("Obfuscation Stats:");
    for (const key in runtimeOptions.processed.map) {
        if (runtimeOptions.processed.map[key]?.type === WordEncryptionType.ignore) {
            console.warn("Ignored", `${key} -> ${key} (${runtimeOptions.processed.map[key]?.count} times)`);
        }
    }

    for (const key in runtimeOptions.processed.map) {
        if (runtimeOptions.processed.map[key]?.type === WordEncryptionType.static) {
            console.warn(
                "Static",
                `${key} -> ${runtimeOptions.processed.map[key]?.target} (${runtimeOptions.processed.map[key]?.count} times)`,
            );
        }
    }

    for (const key in runtimeOptions.processed.map) {
        if (runtimeOptions.processed.map[key]?.type === WordEncryptionType.pool) {
            console.warn(
                "Pool",
                `${key} -> ${runtimeOptions.processed.map[key]?.target} (${runtimeOptions.processed.map[key]?.count} times)`,
            );
        }
    }

    for (const key in runtimeOptions.processed.map) {
        if (
            !runtimeOptions.processed.map[key]?.type ||
            runtimeOptions.processed.map[key]?.type === WordEncryptionType.default
        ) {
            console.warn(
                "Encrypted",
                `${key} -> ${runtimeOptions.processed.map[key]?.target} (${runtimeOptions.processed.map[key]?.count} times)`,
            );
        }
    }
}

export interface IStatsOptions {
    stats: boolean;
}
