import { OPTIONS_FILE_PATH } from "../../common/constants";
import { buildDefaultOptions } from "../../core/options";
import { writeFile } from "../../fs/writer";
import { log } from "../../index";

export function initCommand() {
  const options = buildDefaultOptions();

  if (options.obfuscationOptions.regexList.length) {
    options.obfuscationOptions.regexList.forEach((regex) => {
      delete regex._regExp;
    });
  }

  writeFile(OPTIONS_FILE_PATH, JSON.stringify(options, null, 4));
  log.success("Codefend", ".codefendrc.json created.");
}
