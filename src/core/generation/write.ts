import fs from "fs";

export function writeFile(path: string, data: string) {
  return fs.writeFileSync(path, data);
}
