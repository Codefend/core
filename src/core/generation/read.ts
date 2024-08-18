import fs from "fs";
import path from "path";

export function readFile(path: string, flag = "r"): string | null {
  try {
    return fs.readFileSync(path, { encoding: "utf8", flag: flag });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function tryParse<T>(json: string): T | null {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error(error);
    return null;
  }
}

//TODO: refactor
export function getAllFileNamesInDir(dirName: string): string[] {
  let files: string[] = [];
  const items = fs.readdirSync(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...getAllFileNamesInDir(`${dirName}/${item.name}`)];
    } else {
      files.push(`${dirName}/${item.name}`);
    }
  }

  return files;
}

export function getCurrentDirectoryName(): string {
  return path.basename(path.resolve(process.cwd()));
}
