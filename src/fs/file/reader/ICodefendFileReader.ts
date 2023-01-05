export interface ICodefendFileReader {
  readFile: (path: string) => string | null;
}
