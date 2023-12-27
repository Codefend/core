import { readFile, tryParse } from "../../core/generation/read.js";
import {
    OPTIONS_FILE_NAME,
    OPTIONS_FILE_PATH,
    PROJECT_DISPLAY_NAME,
    PROJECT_KEBAB_CASE_NAME,
    RC_VERSION,
    VALID_VAR_REGEX,
} from "../../core/utils/constants.js";
import { IOptions } from "../../models/options.js";

export interface ICheckResults {
    warnings: string[];
    errors: string[];
}

export function checkCommand(): IOptions | null {
    const checkResults: ICheckResults = {
        errors: [],
        warnings: [],
    };

    const file = readFile(OPTIONS_FILE_PATH);
    if (!file) {
        checkResults.errors.push(
            `${OPTIONS_FILE_NAME} not found. Please run ${PROJECT_KEBAB_CASE_NAME} -i first to create it.`,
        );
        printCheckResults(checkResults);
        return null;
    }

    const options = tryParse(file) as IOptions | null;

    if (!options) {
        checkResults.errors.push(`${OPTIONS_FILE_NAME} contains an invalid JSON format`);
        printCheckResults(checkResults);
        return null;
    }

    if (options.__meta?.rc?.version && options.__meta?.rc.version !== RC_VERSION) {
        checkResults.warnings.push(
            `${OPTIONS_FILE_NAME} was generated in an older version of ${PROJECT_DISPLAY_NAME}.`,
        );
    }

    if (!VALID_VAR_REGEX.test(options.transformation.prefix)) {
        checkResults.errors.push(`Invalid 'prefix' in ${OPTIONS_FILE_NAME}.`);
    }

    checkTransformationPool(checkResults, options);

    const success = !checkResults.errors.length;
    printCheckResults(checkResults);

    return success ? options : null;
}

function printCheckResults(checkResults: ICheckResults) {
    const message = `Check completed. ${checkResults.errors.length} error(s)  ${checkResults.warnings.length} warning(s) `;
    console.warn(message);

    checkResults.errors.forEach((error) => {
        console.warn(`Error: ${error}`);
    });
    checkResults.warnings.forEach((warning) => {
        console.warn(`Warning: ${warning}`);
    });
}

function checkTransformationPool(checkResults: ICheckResults, options: IOptions) {
    if (!options.transformation.pool) return;

    const poolArray =
        typeof options.transformation.pool === "string"
            ? options.transformation.pool.split(" ")
            : options.transformation.pool;
    const poolSet = new Set<string>(poolArray);
    poolSet.forEach((word) => {
        if (!VALID_VAR_REGEX.test(word)) {
            checkResults.errors.push(`Invalid 'customGeneratedWords' in ${OPTIONS_FILE_NAME}. word:"${word}"`);
        }
    });
}
