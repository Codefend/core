import { CLI_OPTIONS, DEFAULT_CLI_OPTION } from "../core/utils/constants.js";
import { checkCommand } from "./commands/check.js";
import { helpCommand } from "./commands/help.js";
import { initCommand } from "./commands/init.js";
import { obfuscateCommand } from "./commands/obfuscate.js";
import { unknownCommand } from "./commands/unknown.js";
import { versionCommand } from "./commands/version.js";

export function startCLI() {
    const inputArgs = process.argv.splice(2);
    const selectedArg: string = inputArgs.length > 0 ? inputArgs[0] ?? DEFAULT_CLI_OPTION : DEFAULT_CLI_OPTION;

    const option = CLI_OPTIONS.find((e) => [e.short, e.long].includes(selectedArg));
    switch (option?.short) {
        case "-h":
            helpCommand();
            break;
        case "-v":
            versionCommand();
            break;
        case "-i":
            initCommand();
            break;
        case "-c":
            checkCommand();
            break;
        case "-o":
            obfuscateCommand(checkCommand());
            break;
        default:
            unknownCommand(selectedArg);
            break;
    }
}
