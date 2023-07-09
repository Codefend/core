import { IInternalStaticWordTransformationOption } from "../../models/internal";
import { IRuntimeOptions, WordEncryptionType } from "../runtime";

export function mapStaticWords(options: IMapStaticWordsOptions, runtimeOptions: IRuntimeOptions) {
  options.static.forEach((staticWord) => {
    runtimeOptions.map[staticWord.from] = staticWord.to;

    if (staticWord.from in runtimeOptions.processed.map) {
      runtimeOptions.processed.map[staticWord.from].target = staticWord.to;
      runtimeOptions.processed.map[staticWord.from].type = WordEncryptionType.static;
    } else {
      runtimeOptions.processed.map[staticWord.from] = {
        count: 0,
        target: staticWord.to,
        type: WordEncryptionType.static,
      };
    }
  });
}

export interface IMapStaticWordsOptions {
  static: IInternalStaticWordTransformationOption[];
}
