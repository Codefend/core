import { CodefendCLI } from "./cli/CodefendCLI";
import { CodefendMapper } from "./core/mapper/CodefendMapper";
import { ICodefendMapper } from "./core/mapper/ICodefendMapper";
import {
  ICodefendOptions,
  defaultOptions,
} from "./core/options/ICodefendOptions";
import { CodefendParser } from "./core/parser/CodefendParser";
import { ICodefendParser } from "./core/parser/ICodefendParser";
import { CodefendReplacer } from "./core/replacer/CodefendReplacer";
import { ICodefendReplacer } from "./core/replacer/ICodefendReplacer";
import { CodefendFileReader } from "./fs/file/reader/CodefendFileReader";
import { ICodefendFileReader } from "./fs/file/reader/ICodefendFileReader";
import { CodefendFileWriter } from "./fs/file/writer/CodefendFileWriter";
import { ICodefendFileWriter } from "./fs/file/writer/ICodefendFileWriter";
import { CodefendFolderManager } from "./fs/folder/CodefendFolderManager";
import { ICodefendFolderManager } from "./fs/folder/ICodefendFolderManager";
import { CodefendLogger } from "./logger/CodefendLogger";

export const logger = new CodefendLogger(defaultOptions);
export const cli = new CodefendCLI();
export const fileSystem: ICodefendFileSystem = {
  fileWriter: new CodefendFileWriter(),
  fileReader: new CodefendFileReader(),
  folderManager: new CodefendFolderManager(),
};
export const codefendDefaultOptions = defaultOptions;

export const CodefendCore: ICodefendCore = {
  parser: new CodefendParser(),
  mapper: new CodefendMapper(),
  replacer: new CodefendReplacer(),
};

export function obfuscate(
  code: string,
  map: Record<string, string> = {},
  options?: ICodefendOptions
) {
  options = options ?? ({} as ICodefendOptions);
  options = { ...codefendDefaultOptions, ...options };

  const words = CodefendCore.parser.parse(
    code,
    options.obfuscationOptions.regexList
  );
  CodefendCore.mapper.buildMap(words, map, {
    prefix: options.obfuscationOptions.prefix,
    debug: options.debug,
  });
  map = CodefendCore.mapper.sortMap(map);
  CodefendCore.mapper.mapPredefinedWords(
    map,
    options.obfuscationOptions.predefinedWords
  );
  CodefendCore.mapper.mapIgnoredWords(
    map,
    options.obfuscationOptions.ignoredWords
  );
  const output = CodefendCore.replacer.replace(code, map);
  return output;
}

export interface ICodefendCore {
  parser: ICodefendParser;
  mapper: ICodefendMapper;
  replacer: ICodefendReplacer;
}

export interface ICodefendFileSystem {
  fileWriter: ICodefendFileWriter;
  fileReader: ICodefendFileReader;
  folderManager: ICodefendFolderManager;
}
