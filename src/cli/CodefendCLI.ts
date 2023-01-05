import { Command, OptionValues } from "commander";
import { version } from "../../package.json";
import { CodefendCheckCommand } from "./commands/CodefendCheckCommand";
import { CodefendInitCommand } from "./commands/CodefendInitCommand";
import { CodefendObfuscateCommand } from "./commands/CodefendObfuscateCommand";
import { ICodefendCLI } from "./ICodefendCLI";
export class CodefendCLI implements ICodefendCLI {
  initCommand: CodefendInitCommand;
  checkCommand: CodefendCheckCommand;
  obfuscateCommand: CodefendObfuscateCommand;

  constructor() {
    this.initCommand = new CodefendInitCommand();
    this.checkCommand = new CodefendCheckCommand();
    this.obfuscateCommand = new CodefendObfuscateCommand();
  }

  start() {
    const program = this.buildCommand();
    const options = program.opts();
    this.executeCommand(program, options);
  }

  buildCommand() {
    return new Command()
      .version(version)
      .description("Defend Your Code By All Means Necessary.")
      .option("-i, --init", "Create .codefendrc.json (configuration file)")
      .option(
        "-c, --check",
        "Check .codefendrc.json for potential warnings/errors"
      )
      .option(
        "-o, --obfuscate",
        "Obfuscate your project (based on .codefendrc.json)"
      )
      .parse(process.argv);
  }

  executeCommand(program: Command, options: OptionValues) {
    if (options.init) {
      this.initCommand.execute();
    }

    if (options.check) {
      this.checkCommand.execute();
    }

    if (options.obfuscate) {
      const options = this.checkCommand.execute();
      this.obfuscateCommand.execute(options);
    }

    if (options.help || !process.argv.slice(2).length) {
      program.outputHelp();
    }
  }
}
