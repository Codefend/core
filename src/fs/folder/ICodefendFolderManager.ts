export interface ICodefendFolderManager {
  copyFolderSync(from: string, to: string, ignoredFilesInGeneration: string[]): void;
  removeFolder(path: string): void;
  getAllFileNamesInDir(dirName: string): unknown[];
}
