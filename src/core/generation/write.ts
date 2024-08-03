import fs from "fs";

export function writeFile(path: string, data: string): void {
  fs.writeFileSync(path, data);
}
