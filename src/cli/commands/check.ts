import { readFile, tryParse } from "../../core/generation/read.js";
import {
  CODEFEND_CHECK_ERROR,
  CODEFEND_CHECK_WARNING,
  DEFAULT_PREFIX,
  OPTIONS_FILE_NAME,
  OPTIONS_FILE_PATH,
  PARSER_NAMES,
  RC_VERSION,
  VALID_VAR_REGEX,
} from "../../core/utils/constants.js";
import { ICheckResults } from "../../models/ICheck.js";
import { IOptions } from "../../models/options.js";

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
  checkResults.errors.push(CODEFEND_CHECK_ERROR.configurationFileNotFound);
  printCheckResults(checkResults, null);
}

function onInvalidJsonError(checkResults: ICheckResults): void {
  checkResults.errors.push(CODEFEND_CHECK_ERROR.configurationFileInvalidJSON);
  printCheckResults(checkResults, null);
}

function validateMetaVersion(checkResults: ICheckResults, options: IOptions): void {
  if (options.debug?.ignoredWarnings?.includes(CODEFEND_CHECK_WARNING.version.code)) {
    return;
  }
  if (options.__meta?.rc?.version && options.__meta.rc.version !== RC_VERSION) {
    checkResults.warnings.push(CODEFEND_CHECK_WARNING.version);
  }
}

function validateGenerationPackageLock(checkResults: ICheckResults, options: IOptions): void {
  if (options.generation?.ignore == null) {
    return;
  }
  if (options.debug?.ignoredWarnings?.includes(CODEFEND_CHECK_WARNING.ignoreMissingPackageLock.code)) {
    return;
  }
  if (!options.generation?.ignore?.includes("package-lock.json")) {
    checkResults.warnings.push(CODEFEND_CHECK_WARNING.ignoreMissingPackageLock);
  }
}

function validateDeprecatedParser(checkResults: ICheckResults, options: IOptions): void {
  if (options.debug?.ignoredWarnings?.includes(CODEFEND_CHECK_WARNING.deprecatedDefaultParser.code)) {
    return;
  }
  if (options.parser?.name === PARSER_NAMES.Parser_A) {
    checkResults.warnings.push(CODEFEND_CHECK_WARNING.deprecatedDefaultParser);
  }
}

function validateTransformationPrefix(checkResults: ICheckResults, options: IOptions): void {
  if (!VALID_VAR_REGEX.test(options.transformation?.prefix ?? DEFAULT_PREFIX)) {
    checkResults.errors.push(CODEFEND_CHECK_ERROR.transformationInvalidPrefix);
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
        code: CODEFEND_CHECK_ERROR.transformationInvalidPool.code,
        message: `Invalid 'pool' in ${OPTIONS_FILE_NAME}. word:"${word}"`,
      });
    }
  });
}

function printCheckResults(checkResults: ICheckResults, options: IOptions | null): void {
  const hasIgnoredAllWarnings = options?.debug?.ignoredWarnings == "all";
  const message = `Check completed. ${checkResults.errors.length} error(s)  ${hasIgnoredAllWarnings ? 0 : checkResults.warnings.length} warning(s) `;
  console.warn(message);

  checkResults.errors.forEach((error) => {
    console.warn(`\n[${error.code}]: ${error.message}`);
  });
  if (hasIgnoredAllWarnings) {
    return;
  }
  checkResults.warnings.forEach((warning) => {
    console.warn(`\n[${warning.code}]: ${warning.message}`);
    console.warn(printIgnoreWarningSentence(warning.code));
  });
}

function printIgnoreWarningSentence(warningCode: string): string {
  return `To turn off this warning, add '${warningCode}' to the 'ignoredWarnings' list or set 'ignoredWarnings':'all' in your ${OPTIONS_FILE_NAME}.\nFor more information, visit this link: https://codefend.github.io/docs/references/configuration#debug.`;
}
