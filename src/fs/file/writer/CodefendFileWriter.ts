import fs from "fs";
import { ICodefendFileWriter } from "./ICodefendFileWriter";

export class CodefendFileWriter implements ICodefendFileWriter {
  writeFile(path: string, data: string) {
    return fs.writeFileSync(path, data);
  }
}
