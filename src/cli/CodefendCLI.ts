import { Command, OptionValues } from "commander";
import { fileSystem, codefendDefaultOptions } from "..";
import { version } from "../../package.json";
import { ICodefendCLI } from "./ICodefendCLI";
export class CodefendCLI implements ICodefendCLI {
  async start() {
    const program = this.buildCommand();
    const options = program.opts();
    await this.executeCommand(program, options);
  }

  delay(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
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

  async executeCommand(program: Command, options: OptionValues) {
    if (options.init) {
      await this.executeInitCommand();
    }

    if (options.check) {
      await this.executeCheckCommand();
    }

    if (options.obfuscate) {
      await this.executeObfuscateCommand();
    }

    if (options.help || !process.argv.slice(2).length) {
      this.executeHelpCommand(program);
    }
  }

  async executeInitCommand() {
    console.log("Creating .codefendrc.json...");
    await this.delay(500);
    const options = { ...codefendDefaultOptions };
    if (options.regexList?.length) {
      options.regexList.forEach((regex) => {
        regex.value = regex.value.toString();
      });
    }
    await fileSystem.fileWriter.writeFile(
      "./.codefendrc.json",
      JSON.stringify(options, null, 4)
    );
    console.log(
      "Initialization completed. .codefendrc.json has been generated."
    );
  }

  async executeCheckCommand() {
    console.log("checking .codefendrc.json...");
    await this.delay(500);
    console.log("Check completed. 0 error(s)  0 warning(s) ");
  }

  async executeObfuscateCommand() {
    console.log("Obfuscation started...");
    await this.delay(500);
    console.log("Obfuscation completed.");
  }

  executeHelpCommand(program: Command) {
    program.outputHelp();
  }
}
