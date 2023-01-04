export interface ICodefendFileWriter {
  writeFile: (path: string, data: string) => Promise<void>;
}
