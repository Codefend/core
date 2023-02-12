import fs from "fs";
import path from "path";

export function copyFolder(from: string, to: string, ignoredFilesInGeneration: string[]) {
  if (!fs.existsSync(to)) fs.mkdirSync(to);
  fs.readdirSync(from).forEach((element) => {
    if (ignoredFilesInGeneration.includes(element)) return;
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else {
      copyFolder(path.join(from, element), path.join(to, element), ignoredFilesInGeneration);
    }
  });
}
