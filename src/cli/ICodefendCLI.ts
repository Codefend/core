export interface ICodefendCLI {
  start: () => void;
  delay: (ms: number) => Promise<unknown>;
}
