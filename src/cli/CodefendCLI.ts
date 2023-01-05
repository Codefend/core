import { Command, OptionValues } from "commander";
import {
  fileSystem,
  codefendDefaultOptions,
  CodefendCore,
  obfuscate,
} from "..";
import { version } from "../../package.json";
import { ICodefendOptions } from "../core/options/ICodefendOptions";
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
    if (options.obfuscationOptions.regexList?.length) {
      options.obfuscationOptions.regexList.forEach((regex) => {
        delete regex._regExp;
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

    const configFile = fileSystem.fileReader.readFile("./.codefendrc.json");
    if (!configFile) {
      checkResults.errors.push(
        ".codefendrc.json not found. please run codefend -i to create a new one"
      );
    }
    let configObj;
    if (configFile) {
      configObj = fileSystem.fileReader.tryParse(
        configFile
      ) as ICodefendOptions | null;
      if (!configObj) {
        checkResults.errors.push(
          ".codefendrc.json does not contains a valid json format"
        );
      } else {
        if (!configObj.generationOptions) {
          checkResults.errors.push(
            ".codefendrc.json is missing generationOptions. please run codefend -i to create a new one"
          );
          return;
        }

        configObj.obfuscationOptions.regexList?.forEach((regexListOption) => {
          regexListOption._regExp =
            CodefendCore.parser.initializeRegex(regexListOption);
        });
      }
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

    return success ? configObj : null;
  }

  async executeObfuscateCommand() {
    const config = await this.executeCheckCommand();
    if (!config) {
      console.log(
        "Could not start with Obfuscation, please resolve errors first"
      );
      return;
    }
    console.log("Obfuscation started...");
    await this.delay(500);
    if (!config.generationOptions) {
      return;
    }
    console.log("removing existing output folder...");
    fileSystem.folderManager.removeFolder(config.generationOptions.outputDir);
    console.log("copying new files...");
    fileSystem.folderManager.copyFolderSync(
      config.generationOptions.inputDir,
      config.generationOptions.outputDir,
      config.generationOptions.ignoredFilesInGeneration
    );

    const fileNames = fileSystem.folderManager.getAllFileNamesInDir(
      config.generationOptions.outputDir
    );
    console.log(`copied ${fileNames.length} file(s)`);
    const map: Record<string, string> = {};
    let fileCode;
    fileNames.forEach((fileName) => {
      fileCode = fileSystem.fileReader.readFile(fileName as string);
      fileSystem.fileWriter.writeFile(
        fileName as string,
        obfuscate(fileCode ?? "", map, config)
      );
    });
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
