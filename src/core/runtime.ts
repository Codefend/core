export interface IRuntimeOptions {
  map: Record<string, string>;
  processed: {
    map: Record<string, IMapProcessed>;
  };
}

export function buildRuntimeOptions(): IRuntimeOptions {
  return {
    map: {},
    processed: {
      map: {},
    },
  };
}

export enum WordEncryptionType {
  default,
  ignore,
  static,
  pool,
}

export interface IMapProcessed {
  count: number;
  target: string;
  type?: WordEncryptionType;
}
