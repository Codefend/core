export interface ICodefendLogger {
  debug: (
    prefix: string,
    message: string,
    debug: boolean,
    logFunction: (prefix: string, message: string) => void
  ) => void;
  info: (prefix: string, message: string) => void;
  success: (prefix: string, message: string) => void;
  warning: (prefix: string, message: string) => void;
  error: (prefix: string, message: string) => void;
  newLine: () => void;
}
