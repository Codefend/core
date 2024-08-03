import { readFile, tryParse } from "../../core/generation/read.js";
import {
  DEFAULT_PARSER_NAME,
  DEFAULT_PREFIX,
  OPTIONS_FILE_NAME,
  OPTIONS_FILE_PATH,
  PARSER_NAMES,
  PROJECT_DISPLAY_NAME,
  PROJECT_KEBAB_CASE_NAME,
  RC_VERSION,
  VALID_VAR_REGEX,
} from "../../core/utils/constants.js";
import { IOptions } from "../../models/options.js";

export type ICheckResult = {
  code: string;
  message: string;
};

export type ICheckResults = {
  warnings: ICheckResult[];
  errors: ICheckResult[];
};

export function checkCommand(): IOptions | null {
  const checkResults = initializeCheckResults();
  const file = loadOptionsFile();

  if (!file) {
    onFileNotFoundError(checkResults);
    return null;
  }

  const options = parseOptions(file);
  if (!options) {
    onInvalidJsonError(checkResults);
    return null;
  }

  validateOptionsVersion(checkResults, options);
  validateGenerationIgnore(checkResults, options);
  validatePrefix(checkResults, options);
  validateParser(checkResults, options);
  checkTransformationPool(checkResults, options);

  const success = !checkResults.errors.length;
  printCheckResults(checkResults);

  return success ? options : null;
}

function initializeCheckResults(): ICheckResults {
  return {
    errors: [],
    warnings: [],
  };
}

function loadOptionsFile(): string | null {
  return readFile(OPTIONS_FILE_PATH);
}

function parseOptions(file: string): IOptions | null {
  return tryParse<IOptions>(file);
}

function onFileNotFoundError(checkResults: ICheckResults): void {
  checkResults.errors.push({
    code: "FILE_NOT_FOUND_ERROR",
    message: `${OPTIONS_FILE_NAME} not found. Please run ${PROJECT_KEBAB_CASE_NAME} -i first to create it.`,
  });
  printCheckResults(checkResults);
}

function onInvalidJsonError(checkResults: ICheckResults): void {
  checkResults.errors.push({
    code: "INVALID_JSON_ERROR",
    message: `${OPTIONS_FILE_NAME} contains an invalid JSON format`,
  });
  printCheckResults(checkResults);
}

function validateOptionsVersion(checkResults: ICheckResults, options: IOptions): void {
  if (options.__meta?.rc?.version && options.__meta.rc.version !== RC_VERSION) {
    checkResults.warnings.push({
      code: "VERSION_WARNING",
      message: `${OPTIONS_FILE_NAME} was generated in an older version of ${PROJECT_DISPLAY_NAME}.`,
    });
  }
}

function validateGenerationIgnore(checkResults: ICheckResults, options: IOptions): void {
  if (options.transformation?.ignore == null) {
    return;
  }
  if (!options.transformation.ignore.includes("package-lock.json")) {
    checkResults.warnings.push({
      code: "GENERATION_PACKAGE_LOCK_WARNING",
      message: `The 'package-lock.json' entry was not found in the 'ignore' list under 'generation' in your ${OPTIONS_FILE_NAME}.
      It is recommended to add it to avoid potential issues.
      To disable this warning, add 'GENERATION_PACKAGE_LOCK_WARNING' to the 'ignoreWarning' section in your ${OPTIONS_FILE_NAME}.`,
    });
  }
}

function validatePrefix(checkResults: ICheckResults, options: IOptions): void {
  if (!VALID_VAR_REGEX.test(options.transformation?.prefix ?? DEFAULT_PREFIX)) {
    checkResults.errors.push({
      code: "INVALID_PREFIX_ERROR",
      message: `Invalid 'prefix' in ${OPTIONS_FILE_NAME}.`,
    });
  }
}

function validateParser(checkResults: ICheckResults, options: IOptions): void {
  if (options.parser?.name === PARSER_NAMES.Parser_A) {
    checkResults.warnings.push({
      code: "PARSER_A_WARNING",
      message: `${PARSER_NAMES.Parser_A} has been deprecated.
      Please rename '${PARSER_NAMES.Parser_A}' to '${DEFAULT_PARSER_NAME}' in your ${OPTIONS_FILE_NAME}.
      This change will not affect functionality; it's only a name update.
      To disable this warning, add 'PARSER_A_WARNING' to the 'ignoreWarning' section in your ${OPTIONS_FILE_NAME}.`,
    });
  }
}

function checkTransformationPool(checkResults: ICheckResults, options: IOptions): void {
  if (!options.transformation?.pool) {
    return;
  }

  const poolArray =
    typeof options.transformation.pool === "string"
      ? options.transformation.pool.split(" ")
      : options.transformation.pool;
  const poolSet = new Set<string>(poolArray);
  poolSet.forEach((word) => {
    if (!VALID_VAR_REGEX.test(word)) {
      checkResults.errors.push({
        code: "INVALID_CUSTOM_WORD_ERROR",
        message: `Invalid 'customGeneratedWords' in ${OPTIONS_FILE_NAME}. word:"${word}"`,
      });
    }
  });
}

function printCheckResults(checkResults: ICheckResults): void {
  const message = `Check completed. ${checkResults.errors.length} error(s)  ${checkResults.warnings.length} warning(s) `;
  console.warn(message);

  checkResults.errors.forEach((error) => {
    console.warn(`\n${PROJECT_DISPLAY_NAME} Error [${error.code}]: ${error.message}`);
  });
  checkResults.warnings.forEach((warning) => {
    console.warn(`\n${PROJECT_DISPLAY_NAME} Warning [${warning.code}]: ${warning.message}`);
  });
}
