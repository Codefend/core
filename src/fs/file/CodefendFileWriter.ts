import * as fs from "fs/promises";
import { ICodefendFileWriter } from "./ICodefendFileWriter";

export class CodefendFileWriter implements ICodefendFileWriter {
  async writeFile(path: string, data: string) {
    return fs.writeFile(path, data);
  }
}
