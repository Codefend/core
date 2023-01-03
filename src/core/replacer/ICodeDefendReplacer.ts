export interface ICodefendReplacer {
  replace: (map: Record<string, string>, code: string) => string;
}
