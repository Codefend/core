import { IInternalStaticWordTransformationOption } from "../../models/internal.js";
import { IRuntimeOptions, WordEncryptionType } from "../process/runtime.js";

export function mapStaticWords(options: IMapStaticWordsOptions, runtimeOptions: IRuntimeOptions): void {
  options.static.forEach((staticWord) => {
    runtimeOptions.map[staticWord.from] = staticWord.to;

    const element = runtimeOptions.processed.map[staticWord.from];
    if (element) {
      element.target = staticWord.to;
      element.type = WordEncryptionType.static;
    } else {
      runtimeOptions.processed.map[staticWord.from] = {
        count: 0,
        target: staticWord.to,
        type: WordEncryptionType.static,
      };
    }
  });
}

export type IMapStaticWordsOptions = {
  static: IInternalStaticWordTransformationOption[];
};
