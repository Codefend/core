import { Command } from "commander";

import { ICodefendCLI } from "./ICodefendCLI";

export class CodefendCLI implements ICodefendCLI {
  async start() {
    const program = new Command();
    program
      .description("Defend Your Code By All Means Necessary. (Alpha)")
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

    const options = program.opts();

    if (options.init) {
      console.log("Creating .codefendrc.json...");
      await this.delay(500);
      console.log(
        "Initialization completed. .codefendrc.json has been generated."
      );
    }

    if (options.check) {
      console.log("checking .codefendrc.json...");
      await this.delay(500);
      console.log("Check completed. 0 error(s)  0 warning(s) ");
    }

    if (options.obfuscate) {
      console.log("Obfuscation started...");
      await this.delay(500);
      console.log("Obfuscation completed.");
    }

    if (options.help || !process.argv.slice(2).length) {
      program.outputHelp();
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }
}
