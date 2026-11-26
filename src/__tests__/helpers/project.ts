import fs from "fs";
import os from "os";
import path from "path";

export type ITestProject = {
  root: string;
  input: string;
  output: string;
};

export function createTestProject(): ITestProject {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "codefend-test-"));
  const input = path.join(root, "input");
  fs.mkdirSync(input);
  return { root, input, output: path.join(root, "output") };
}

export function removeTestProject(project: ITestProject): void {
  const root = path.resolve(project.root);
  if (path.dirname(root) !== path.resolve(os.tmpdir()) || !path.basename(root).startsWith("codefend-test-")) {
    throw new Error("Refusing to remove a directory outside the test fixtures.");
  }
  fs.rmSync(root, { recursive: true, force: true });
}
