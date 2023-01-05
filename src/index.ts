import { ICodefendFolderManager } from "./../build/src/fs/folder/ICodefendFolderManager.d";
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
  parser: new CodefendParser(defaultOptions, logger),
  mapper: new CodefendMapper(defaultOptions, logger),
  replacer: new CodefendReplacer(logger),
};

export function obfuscate(
  code: string,
  map: Record<string, string> = {},
  options?: ICodefendOptions
) {
  const words = CodefendCore.parser.parse(code, options?.regexList);
  CodefendCore.mapper.buildMap(words, map, options?.prefix);
  map = CodefendCore.mapper.sortMap(map);
  CodefendCore.mapper.mapPredefinedWords(map, options?.predefinedWords);
  CodefendCore.mapper.mapIgnoredWords(map, options?.ignoredWords);
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
