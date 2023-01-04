export interface ICodefendReplacer {
  replace: (code: string, map: Record<string, string>) => string;
}
