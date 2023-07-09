import { log } from "../../common";
import { OPTIONS_FILE_PATH, RC_VERSION, VALID_VAR_REGEX } from "../../common/constants";
import { readFile, tryParse } from "../../fs/reader";
import { IOptions } from "../../models/options";

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
    checkResults.errors.push(".codefendrc.json contains an invalid JSON format");
    printCheckResults(checkResults);
    return null;
  }

  if (options.__meta) {
    if (options.__meta.rcVersion !== RC_VERSION) {
      checkResults.warnings.push(".codefendrc.json was generated in an older version of Codefend.");
    }
  }

  if (!VALID_VAR_REGEX.test(options.transformation.prefix)) {
    checkResults.errors.push("Invalid 'prefix' in .codefendrc.json.");
  }

  checkTransformationPool(checkResults, options);

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

function checkTransformationPool(checkResults: ICheckResults, options: IOptions) {
  if (!options.transformation.pool) return;

  const poolArray =
    typeof options.transformation.pool === "string"
      ? options.transformation.pool.split(" ")
      : options.transformation.pool;
  const poolSet = new Set<string>(poolArray);
  poolSet.forEach((word) => {
    if (!VALID_VAR_REGEX.test(word)) {
      checkResults.errors.push(`Invalid 'customGeneratedWords' in .codefendrc.json. word:"${word}"`);
    }
  });
}
