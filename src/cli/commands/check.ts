import { log } from "../../common";
import { OPTIONS_FILE_PATH } from "../../common/constants";
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

  if (!options.generationOptions) {
    checkResults.errors.push(
      ".codefendrc.json is missing generationOptions. please run codefend -i to create a new one"
    );
    printCheckResults(checkResults);
    return null;
  }

  const success = !checkResults.errors.length;
  printCheckResults(checkResults);

  return success ? options : null;
}

function printCheckResults(checkResults: ICheckResults) {
  const message = `Check completed. ${checkResults.errors.length} error(s)  ${checkResults.warnings.length} warning(s) `;

  if (checkResults.errors.length) {
    log.error("Codefend", message);
  } else if (checkResults.warnings.length) {
    log.warning("Codefend", message);
  } else {
    log.success("Codefend", message);
  }
  checkResults.errors.forEach((error) => {
    log.error("Codefend", `Error: ${error}`);
  });
  checkResults.warnings.forEach((warning) => {
    log.warning("Codefend", `Warning: ${warning}`);
  });
}
