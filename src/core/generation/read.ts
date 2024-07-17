import fs from "fs";
import path from "path";

export function readFile(path: string, flag = "r") {
  try {
    return fs.readFileSync(path, { encoding: "utf8", flag: flag });
  } catch (e) {
    return null;
  }
}

export function tryParse(json: string) {
  try {
    return JSON.parse(json) as unknown;
  } catch (e) {
    return null;
  }
}

//TODO: refactor
export function getAllFileNamesInDir(dirName: string) {
  let files: unknown[] = [];
  const items = fs.readdirSync(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      files = [...files, ...getAllFileNamesInDir(`${dirName}/${item.name}`)];
    } else {
      files.push(`${dirName}/${item.name}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return files;
}

export function getCurrentDirectoryName() {
  return path.basename(path.resolve(process.cwd()));
}
