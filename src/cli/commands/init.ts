import { getCurrentDirectoryName } from "../../core/generation/read.js";
import { writeFile } from "../../core/generation/write.js";
import { buildDefaultOptions } from "../../core/options/options.js";
import { OPTIONS_FILE_NAME, OPTIONS_FILE_PATH } from "../../core/utils/constants.js";

export function initCommand() {
    const options = buildDefaultOptions(getCurrentDirectoryName());
    writeFile(OPTIONS_FILE_PATH, JSON.stringify(options, null, 4));
    console.log(`${OPTIONS_FILE_NAME} created.`);
}
