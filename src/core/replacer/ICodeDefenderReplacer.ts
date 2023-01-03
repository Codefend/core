export interface ICodeDefenderReplacer {
  replace: (map: Record<string, string>, code: string) => string;
}
