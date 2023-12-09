import { IInternalParserOptions, IInternalTransformationOptions } from "../../models/internal.js";
import { buildMap, sortMap } from "../mapper/mapper.js";
import { parse } from "../parser/parser.js";
import { replace } from "../replacer/replacer.js";
import { mapDefaultWords } from "../transformation/default.js";
import { mapIgnoredWords } from "../transformation/ignore.js";
import { mapPoolWords } from "../transformation/pool.js";
import { mapStaticWords } from "../transformation/static.js";
import { IRuntimeOptions } from "./runtime.js";

export function obfuscate(
    code: string,
    transformationOptions: IInternalTransformationOptions,
    parserOptions: IInternalParserOptions,
    runtimeOptions: IRuntimeOptions,
): string {
    const words = parse({ code: code, parserOptions: parserOptions });

    buildMap({ words: words }, runtimeOptions);

    sortMap(runtimeOptions);

    mapStaticWords({ static: transformationOptions.static }, runtimeOptions);

    mapIgnoredWords({ ignore: transformationOptions.ignore }, runtimeOptions);

    mapPoolWords({ prefix: transformationOptions.prefix, pool: transformationOptions.pool }, runtimeOptions);

    mapDefaultWords({ prefix: transformationOptions.prefix }, runtimeOptions);

    return replace({ code: code }, runtimeOptions);
}
