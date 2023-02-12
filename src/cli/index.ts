import { Command } from "commander";
import { version } from "../../package.json";
import { checkCommand } from "./commands/check";
import { initCommand } from "./commands/init";
import { obfuscateCommand } from "./commands/obfuscate";

export function startCLI() {
  executeCommand(buildCommand());
}

function buildCommand() {
  return new Command()
    .description("Defend Your Code By All Means Necessary =)")
    .option("-i, --init", "Creates the config file (.codefendrc.json)")
    .option("-o, --obfuscate", "Obfuscate the project")
    .option("-c, --check", "Check the config file for potential warnings/errors")
    .version(version, "-v, --version", "Output the version number")
    .helpOption("-h, --help", "Display help for command")
    .parse(process.argv);
}

function executeCommand(command: Command) {
  const options = command.opts();

  if (options.init) {
    initCommand();
  }

  if (options.check) {
    checkCommand();
  }

  if (options.obfuscate) {
    obfuscateCommand(checkCommand());
  }

  if (options.help || !process.argv.slice(2).length) {
    command.outputHelp();
  }
}
