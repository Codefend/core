import fs from "fs";
import { ICodefendFileReader } from "./ICodefendFileReader";

export class CodefendFileReader implements ICodefendFileReader {
  readFile(path: string, flag = "r") {
    try {
      return fs.readFileSync(path, { encoding: "utf8", flag: flag });
    } catch (e) {
      return null;
    }
  }
}
