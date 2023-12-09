import fs from "fs";

export function removeFolder(path: string): void {
    fs.rmSync(path, { recursive: true, force: true });
}
