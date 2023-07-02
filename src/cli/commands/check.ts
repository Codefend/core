import { log } from "../../common";
import { OPTIONS_FILE_PATH, RC_VERSION, VALID_VAR_REGEX } from "../../common/constants";
import { IOptions } from "../../core/options";
import { readFile, tryParse } from "../../fs/reader";

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
    checkResults.errors.push(".codefendrc.json not found. Please run codefend -i first to create it.");
    printCheckResults(checkResults);
    return null;
  }

  const options = tryParse(file) as IOptions | null;

  if (!options) {
    checkResults.errors.push(".codefendrc.json does not contains a valid json format");
    printCheckResults(checkResults);
    return null;
  }

  if (options.__meta) {
    if (options.__meta.rcVersion !== RC_VERSION) {
      checkResults.warnings.push(".codefendrc.json was generated in an older version of Codefend.");
    }
  }

  if (!options.generationOptions) {
    checkResults.errors.push(
      ".codefendrc.json is missing generationOptions. please run codefend -i to create a new one"
    );
    printCheckResults(checkResults);
    return null;
  }

  if (!VALID_VAR_REGEX.test(options.obfuscationOptions.prefix)) {
    checkResults.errors.push("Invalid 'prefix' in .codefendrc.json.");
  }

  checkCustomGeneratedWords(checkResults, options);

  const success = !checkResults.errors.length;
  printCheckResults(checkResults);

  return success ? options : null;
}

function printCheckResults(checkResults: ICheckResults) {
  const message = `Check completed. ${checkResults.errors.length} error(s)  ${checkResults.warnings.length} warning(s) `;
  const logFunction = checkResults.errors.length ? "error" : checkResults.warnings.length ? "warning" : "success";
  log[logFunction]("Codefend", message);

  checkResults.errors.forEach((error) => {
    log.error("Codefend", `Error: ${error}`);
  });
  checkResults.warnings.forEach((warning) => {
    log.warning("Codefend", `Warning: ${warning}`);
  });
}

function isDuplicateExists(arr: string[]) {
  return new Set(arr).size !== arr.length;
}

function checkCustomGeneratedWords(checkResults: ICheckResults, options: IOptions) {
  if (isDuplicateExists(options.obfuscationOptions.customGeneratedWords)) {
    checkResults.errors.push("Invalid 'customGeneratedWords' in .codefendrc.json. (duplicates)");
  }

  options.obfuscationOptions.customGeneratedWords.forEach((word) => {
    if (!VALID_VAR_REGEX.test(word)) {
      checkResults.errors.push(`Invalid 'customGeneratedWords' in .codefendrc.json. word:"${word}"`);
    }
  });
}
