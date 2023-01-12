import { CodefendCLI } from "./cli/CodefendCLI";
import { CodefendMapper } from "./core/mapper/CodefendMapper";
import { ICodefendMapper } from "./core/mapper/ICodefendMapper";
import {
  ICodefendOptions,
  IObfuscateOptions,
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
  options?: IObfuscateOptions
) {
  options = options ?? ({} as IObfuscateOptions);
  const _options = {
    ...codefendDefaultOptions,
    ...options,
  } as ICodefendOptions;

  const words = CodefendCore.parser.parse(
    code,
    _options.obfuscationOptions.regexList
  );
  CodefendCore.mapper.buildMap(words, map, {
    prefix: _options.obfuscationOptions.prefix,
    debug: _options.debug,
    ignoredWords: _options.obfuscationOptions.ignoredWords,
    predefinedWords: _options.obfuscationOptions.predefinedWords,
  });
  map = CodefendCore.mapper.sortMap(map);
  CodefendCore.mapper.mapPredefinedWords(
    map,
    _options.obfuscationOptions.predefinedWords,
    {
      debug: _options.debug,
    }
  );
  CodefendCore.mapper.mapIgnoredWords(
    map,
    _options.obfuscationOptions.ignoredWords,
    {
      debug: _options.debug,
    }
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
