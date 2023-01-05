export interface ICodefendFolderManager {
  copyFolderSync(from: string, to: string): void;
  removeFolder(path: string): void;
}
