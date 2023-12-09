import { IInternalRegexOption } from "../../models/internal.js";

export const PROJECT_KEBAB_CASE_NAME = "codefend";
export const PROJECT_DISPLAY_NAME = "Codefend";
export const OPTIONS_FILE_NAME = ".codefendrc.json";
export const OPTIONS_FILE_PATH = `./${OPTIONS_FILE_NAME}`;
export const VERSION = "0.0.0-development";
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

export const VALID_VAR_REGEX = /^[a-zA-Z_$][a-zA-Z$0-9]*$/g;

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

export const PARSERS: Record<string, { regexList: IInternalRegexOption[] }> = {
    "UO-P1": {
        regexList: [
            {
                name: "main",
                regex: new RegExp("([a-zA-Z]+(_[a-zA-Z0-9]+)+)", "g"),
            },
            {
                name: "file",
                regex: new RegExp("((pkg|cmp|lib|file|folder|module|style|main)+(-[a-zA-Z0-9]+)+)", "g"),
            },
        ],
    },
};

export const DEFAULT_PARSER_NAME = "UO-P1";
export const CUSTOM_PARSER_NAME = "CUSTOM";
