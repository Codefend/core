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
    fileSystem.fileWriter.writeFile(
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
    const checkResults: ICheckResults = {
      errors: [],
      warnings: [],
    };

    const config = fileSystem.fileReader.readFile("./.codefendrc.json");
    if (!config) {
      checkResults.errors.push(
        ".codefendrc.json not found. please run codefend -i to create a new one"
      );
    }

    console.log(
      `Check completed. ${checkResults.errors.length} error(s)  ${checkResults.warnings.length} warning(s) `
    );
    checkResults.errors.forEach((error) => {
      console.log(`Error: ${error}`);
    });
    checkResults.warnings.forEach((warning) => {
      console.log(`Warning: ${warning}`);
    });

    const success = !checkResults.errors.length;

    return success;
  }

  async executeObfuscateCommand() {
    const checkSuccess = await this.executeCheckCommand();
    if (!checkSuccess) {
      console.log("Could not start with Obfuscation, check contains errors");
      return;
    }
    console.log("Obfuscation started...");
    await this.delay(500);
    console.log("Obfuscation completed.");
  }

  executeHelpCommand(program: Command) {
    program.outputHelp();
  }
}

export interface ICheckResults {
  warnings: string[];
  errors: string[];
}
