import { readFile, tryParse } from "../../core/generation/read.js";
import {
  CODEFEND_CHECK_ERROR_CODES,
  CODEFEND_CHECK_ERROR_MESSAGES,
  CODEFEND_CHECK_WARNING_CODES,
  CODEFEND_CHECK_WARNING_MESSAGES,
  DEFAULT_PREFIX,
  OPTIONS_FILE_NAME,
  OPTIONS_FILE_PATH,
  PARSER_NAMES,
  RC_VERSION,
  VALID_VAR_REGEX,
} from "../../core/utils/constants.js";
import { ICheckErrorCodes, ICheckWarningCodes, IStringModifierFunction } from "../../models/types.js";
import { IOptions } from "../../models/options.js";

export type ICheckResult = {
  code: ICheckErrorCodes | ICheckWarningCodes;
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

  validateMetaVersion(checkResults, options);
  validateDeprecatedParser(checkResults, options);
  validateGenerationPackageLock(checkResults, options);
  validateTransformationPrefix(checkResults, options);
  validateTransformationPool(checkResults, options);

  const success = !checkResults.errors.length;
  printCheckResults(checkResults, options);

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
    code: CODEFEND_CHECK_ERROR_CODES.FILE_NOT_FOUND_ERROR,
    message: CODEFEND_CHECK_ERROR_MESSAGES.FILE_NOT_FOUND_ERROR as string,
  });
  printCheckResults(checkResults, null);
}

function onInvalidJsonError(checkResults: ICheckResults): void {
  checkResults.errors.push({
    code: CODEFEND_CHECK_ERROR_CODES.INVALID_JSON_ERROR,
    message: CODEFEND_CHECK_ERROR_MESSAGES.INVALID_JSON_ERROR as string,
  });
  printCheckResults(checkResults, null);
}

function validateMetaVersion(checkResults: ICheckResults, options: IOptions): void {
  if (options.debug?.ignoredWarnings?.includes(CODEFEND_CHECK_WARNING_CODES.VERSION_WARNING)) {
    return;
  }
  if (options.__meta?.rc?.version && options.__meta.rc.version !== RC_VERSION) {
    checkResults.warnings.push({
      code: CODEFEND_CHECK_WARNING_CODES.VERSION_WARNING,
      message: CODEFEND_CHECK_WARNING_MESSAGES.VERSION_WARNING,
    });
  }
}

function validateGenerationPackageLock(checkResults: ICheckResults, options: IOptions): void {
  if (options.generation?.ignore == null) {
    return;
  }
  if (options.debug?.ignoredWarnings?.includes(CODEFEND_CHECK_WARNING_CODES.GENERATION_PACKAGE_LOCK_WARNING)) {
    return;
  }
  if (!options.generation?.ignore?.includes("package-lock.json")) {
    checkResults.warnings.push({
      code: CODEFEND_CHECK_WARNING_CODES.GENERATION_PACKAGE_LOCK_WARNING,
      message: CODEFEND_CHECK_WARNING_MESSAGES.GENERATION_PACKAGE_LOCK_WARNING,
    });
  }
}

function validateDeprecatedParser(checkResults: ICheckResults, options: IOptions): void {
  if (options.debug?.ignoredWarnings?.includes(CODEFEND_CHECK_WARNING_CODES.PARSER_A_WARNING)) {
    return;
  }
  if (options.parser?.name === PARSER_NAMES.Parser_A) {
    checkResults.warnings.push({
      code: CODEFEND_CHECK_WARNING_CODES.PARSER_A_WARNING,
      message: CODEFEND_CHECK_WARNING_MESSAGES.PARSER_A_WARNING,
    });
  }
}

function validateTransformationPrefix(checkResults: ICheckResults, options: IOptions): void {
  if (!VALID_VAR_REGEX.test(options.transformation?.prefix ?? DEFAULT_PREFIX)) {
    checkResults.errors.push({
      code: CODEFEND_CHECK_ERROR_CODES.INVALID_PREFIX_ERROR,
      message: CODEFEND_CHECK_ERROR_MESSAGES.INVALID_PREFIX_ERROR as string,
    });
  }
}

function validateTransformationPool(checkResults: ICheckResults, options: IOptions): void {
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
        code: CODEFEND_CHECK_ERROR_CODES.INVALID_CUSTOM_WORD_ERROR,
        message: (CODEFEND_CHECK_ERROR_MESSAGES.INVALID_CUSTOM_WORD_ERROR as IStringModifierFunction)(word),
      });
    }
  });
}

function printCheckResults(checkResults: ICheckResults, options: IOptions | null): void {
  const message = `Check completed. ${checkResults.errors.length} error(s)  ${checkResults.warnings.length} warning(s) `;
  console.warn(message);

  checkResults.errors.forEach((error) => {
    console.warn(`\n[${error.code}]: ${error.message}`);
  });
  if (options?.debug?.ignoredWarnings == "all") {
    return;
  }
  checkResults.warnings.forEach((warning) => {
    console.warn(`\n[${warning.code}]: ${warning.message}`);
    console.warn(printIgnoreWarningSentence(warning.code));
  });
}

function printIgnoreWarningSentence(warningCode: string): string {
  return `To turn off this warning, add '${warningCode}' to the 'ignoredWarnings' list or set 'ignoredWarnings':'all' in your ${OPTIONS_FILE_NAME}.\nYou should add this configuration under the debug section.\nFor more information, visit this link: https://codefend.github.io/docs/references/configuration#debug.`;
}
