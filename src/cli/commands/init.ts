import { OPTIONS_FILE_PATH } from "../../common/constants";
import { buildDefaultOptions } from "../../core/options";
import { writeFile } from "../../fs/writer";
import { log } from "../../index";

export function initCommand() {
  const options = buildDefaultOptions();
  writeFile(OPTIONS_FILE_PATH, JSON.stringify(options, null, 4));
  log.success("Codefend", ".codefendrc.json created.");
}
