import { version } from "../../../package.json";
import { IInternalRegexOption } from "../../models/internal.js";
import { IParserNames } from "../../models/types";

export const PROJECT_KEBAB_CASE_NAME = "codefend";
export const PROJECT_DISPLAY_NAME = "Codefend";
export const OPTIONS_FILE_NAME = ".codefendrc.json";
export const OPTIONS_FILE_PATH = `./${OPTIONS_FILE_NAME}`;
export const VERSION = version;
export const RC_VERSION = "0.0.1";
export const DEFAULT_PROJECT_NAME = "project";

export const LOG_OPTIONS = {
  PREFIX_SIZE: 11,
  MESSAGE_SIZE: 64,
  COLORS: {
    PREFIX_BG: "#282634",
    PREFIX_FG: "#ff4067",
  },
};

export const DEFAULT_PREFIX = "Ox";

export const VALID_VAR_REGEX = /^[a-zA-Z_$][a-zA-Z$0-9]*$/;

export const MIN_POOL_ITEM_LENGTH = 3;

export const HELP_COMMAND_INTRO = `Usage: ${PROJECT_KEBAB_CASE_NAME} [options]

Protect Any Source Code.

Options:`;

export const DEFAULT_CLI_OPTION = "-h";

export const CLI_OPTIONS = [
  {
    short: "-i",
    long: "--init",
    description: `Create the config file (${OPTIONS_FILE_NAME})`,
  },
  {
    short: "-c",
    long: "--check",
    description: "Obfuscate the project",
  },
  {
    short: "-o",
    long: "--obfuscate",
    description: "Check the config file for potential warnings/errors",
  },
  {
    short: "-v",
    long: "--version",
    description: "Output the version number",
  },
  {
    short: "-h",
    long: "--help",
    description: "Display help for command",
  },
];

const DEFAULT_REGEX_LIST = [
  {
    name: "main",
    regex: new RegExp("([a-zA-Z]+(_[a-zA-Z0-9]+)+)", "g"),
  },
  {
    name: "file",
    regex: new RegExp("((pkg|cmp|lib|file|folder|module|style|main)+(-[a-zA-Z0-9]+)+)", "g"),
  },
];

export const PARSER_NAMES = {
  default: "default",
  fileOnly: "fileOnly",
  codeOnly: "codeOnly",
  Parser_A: "Parser_A",
} as const;

export const PARSERS: Partial<Record<IParserNames, { regexList: IInternalRegexOption[] }>> = {
  [PARSER_NAMES.default]: {
    regexList: DEFAULT_REGEX_LIST,
  },
  [PARSER_NAMES.fileOnly]: {
    regexList: DEFAULT_REGEX_LIST.filter((e) => e.name === "file"),
  },
  [PARSER_NAMES.codeOnly]: {
    regexList: DEFAULT_REGEX_LIST.filter((e) => e.name === "main"),
  },
  [PARSER_NAMES.Parser_A]: {
    regexList: DEFAULT_REGEX_LIST,
  },
};

export const DEFAULT_PARSER_NAME = PARSER_NAMES.default;
export const CUSTOM_PARSER_NAME = "custom";

export const CODEFEND_CHECK_WARNING = {
  version: {
    code: "@meta/version-warning",
    message: `${OPTIONS_FILE_NAME} was generated in an older version of ${PROJECT_DISPLAY_NAME}.`,
  },
  deprecatedDefaultParser: {
    code: "@parser/deprecated-default-parser-warning",
    message: `${PARSER_NAMES.Parser_A} has been deprecated.\nPlease rename '${PARSER_NAMES.Parser_A}' to '${DEFAULT_PARSER_NAME}' in your ${OPTIONS_FILE_NAME}.\nThis change will not affect functionality; it's only a name update.\nFor more information, please refer to this issue: https://github.com/Codefend/core/issues/182.`,
  },
  ignoreMissingPackageLock: {
    code: "@generation/ignore-missing-package-lock-warning",
    message: `The 'package-lock.json' entry was not found in the 'ignore' list under 'generation' in your ${OPTIONS_FILE_NAME}.\nIt is recommended to add it to avoid potential issues.For more information, please refer to this issue: https://github.com/Codefend/core/issues/183.`,
  },
} as const;

export const CODEFEND_CHECK_ERROR = {
  configurationFileNotFound: {
    code: "@config/file-not-found-error",
    message: `${OPTIONS_FILE_NAME} not found. Please run ${PROJECT_KEBAB_CASE_NAME} -i first to create it.`,
  },
  configurationFileInvalidJSON: {
    code: "@config/invalid-json-error",
    message: `${OPTIONS_FILE_NAME} contains an invalid JSON format`,
  },
  transformationInvalidPrefix: {
    code: "@transformation/invalid-prefix-error",
    message: `Invalid 'prefix' in ${OPTIONS_FILE_NAME}.`,
  },
  transformationInvalidPool: {
    code: "@transformation/invalid-pool-error",
    message: "",
  },
} as const;

export const CHECK_MAX_TABLE_COLUMN_WIDTH = 100;
