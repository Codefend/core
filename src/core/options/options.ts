import {
  IInternalDebugOptions,
  IInternalGenerationOptions,
  IInternalParserOptions,
  IInternalResponse,
  IInternalTransformationOptions,
} from "../../models/internal.js";
import { IDebugOptions, IOptions, IParserOptions, ITransformationOptions } from "../../models/options.js";
import {
  CUSTOM_PARSER_NAME,
  DEFAULT_PARSER_NAME,
  DEFAULT_PREFIX,
  DEFAULT_PROJECT_NAME,
  MIN_POOL_ITEM_LENGTH,
  PARSER_NAMES,
  PARSERS,
  PROJECT_KEBAB_CASE_NAME,
  RC_VERSION,
  VERSION,
} from "../utils/constants.js";

export function buildDefaultOptions(projectName?: string): IOptions {
  const options: IOptions = {
    generation: {
      inputDir: ".",
      outputDir: "codefend-output",
      ignore: [
        "codefend-output",
        ".codefendrc.json",
        "node_modules",
        ".git",
        ".github",
        ".gitignore",
        ".vscode",
        "build",
        "dist",
        "README.md",
        "package-lock.json",
      ],
    },

    transformation: {
      prefix: DEFAULT_PREFIX,
      static: [],
      ignore: ["node_modules"],
      pool: [],
    },
    debug: {
      stats: true,
      ignoredWarnings: [],
    },
    parser: {
      name: DEFAULT_PARSER_NAME,
    },
    __meta: {
      projectName: projectName ?? DEFAULT_PROJECT_NAME,
      rc: {
        version: RC_VERSION,
        generatedBy: `${PROJECT_KEBAB_CASE_NAME}@${VERSION}`,
        generatedAt: new Date().toISOString(),
      },
    },
  };

  return options;
}

export function buildTransformationOptions(
  transformationOptions?: ITransformationOptions,
): IInternalTransformationOptions {
  return {
    prefix: transformationOptions?.prefix ?? DEFAULT_PREFIX,
    static: transformationOptions?.static ?? [],
    ignore: transformationOptions?.ignore ?? [],
    pool: buildTransformationPoolOption(transformationOptions?.pool),
  };
}

export function buildTransformationPoolOption(pool: string | string[] | undefined): Array<string> {
  if (!pool) {
    return [];
  }
  const poolWords = typeof pool === "string" ? pool.split(" ") : pool;
  const parsedPoolWords = [];
  let parsedPoolWord = "";

  for (const poolWord of poolWords) {
    parsedPoolWord = poolWord.replace(/([^\w\s]|_|^[0-9]+|\n)/gi, "");
    if (parsedPoolWord.length >= MIN_POOL_ITEM_LENGTH) {
      parsedPoolWords.push(parsedPoolWord.toLowerCase());
    }
  }

  return Array.from(new Set<string>(parsedPoolWords));
}

export function buildParserOptions(parser?: IParserOptions): IInternalResponse<IInternalParserOptions> {
  const ret: IInternalResponse<IInternalParserOptions> = {};
  if (!parser || !parser?.name) {
    return { data: { name: DEFAULT_PARSER_NAME, regexList: PARSERS[DEFAULT_PARSER_NAME]!.regexList } };
  }

  if (parser.name in PARSER_NAMES) {
    return { data: { name: parser.name, regexList: PARSERS[parser.name]!.regexList } };
  }

  if (parser.name.toLowerCase() === CUSTOM_PARSER_NAME.toLowerCase()) {
    if (!parser?.regexList?.length) {
      return {
        error: {
          errorCode: "UO-0000",
          errorDescription: "CUSTOM Parser should have at least 1 regex item in regex list",
        },
      };
    }
    ret.data = { name: CUSTOM_PARSER_NAME, regexList: [] };
    parser.regexList.forEach((e) => {
      ret.data!.regexList.push({ name: e.name, regex: new RegExp(e.value, "g") });
    });
    return ret;
  }

  if (PARSERS[parser.name] === undefined) {
    return { error: { errorCode: "UO-0000", errorDescription: `Parser ${parser?.name} not found` } };
  }

  return { data: { name: parser.name, regexList: PARSERS[parser.name]!.regexList } };
}

export function buildGenerationOptions(options: IOptions): IInternalGenerationOptions {
  return {
    inputDir: options.generation.inputDir,
    outputDir: options.generation.outputDir,
    ignore: buildGenerationIgnoreOptions(options),
  };
}

function buildGenerationIgnoreOptions(options: IOptions): string[] {
  const ret = options.generation.ignore ?? [];
  if (!ret.includes(options.generation.outputDir)) {
    ret.push(options.generation.outputDir);
  }
  return ret;
}

export function buildDebugOptions(debugOptions?: IDebugOptions): IInternalDebugOptions {
  return {
    stats: typeof debugOptions?.stats === "boolean" ? debugOptions.stats : true,
    ignoredWarnings: debugOptions?.ignoredWarnings === undefined ? [] : debugOptions?.ignoredWarnings,
  };
}
