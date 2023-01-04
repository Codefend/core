export interface ICodefendLogger {
  log: (scope: string, type: string, message: unknown) => void;
}
