export interface ICodefendFileReader {
  readFile: (path: string) => string | null;
  tryParse: (json: string) => unknown | null;
}
