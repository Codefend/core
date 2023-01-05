import fs from "fs";
import path from "path";
import { ICodefendFolderManager } from "./ICodefendFolderManager";

export class CodefendFolderManager implements ICodefendFolderManager {
  copyFolderSync(from: string, to: string) {
    if (!fs.existsSync(to)) fs.mkdirSync(to);
    fs.readdirSync(from).forEach((element) => {
      if (
        [
          "node_modules",
          ".git",
          ".github",
          ".vscode",
          "codefend-output",
          "build",
          "dist",
        ].includes(element)
      )
        return;
      if (fs.lstatSync(path.join(from, element)).isFile()) {
        fs.copyFileSync(path.join(from, element), path.join(to, element));
      } else {
        this.copyFolderSync(path.join(from, element), path.join(to, element));
      }
    });
  }

  removeFolder(path: string): void {
    fs.rmSync(path, { recursive: true, force: true });
  }
}
