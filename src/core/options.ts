import { version } from "../../package.json";
import { RC_VERSION, MIN_POOL_ITEM_LENGTH } from "../common/constants";
import {
  IInternalDebugOptions,
  IInternalGenerationOptions,
  IInternalParserOptions,
  IInternalTransformationOptions,
} from "../models/internal";
import { IOptions } from "../models/options";

export function buildDefaultOptions(): IOptions {
  const options = {
    generation: {
      inputDir: ".",
      outputDir: "codefend-output",
      ignore: [
        "codefend-output",
        ".rc.json",
        "node_modules",
        ".git",
        ".github",
        ".gitignore",
        ".vscode",
        "build",
        "dist",
        "README.md",
      ],
    },

    transformation: {
      prefix: "Ox",
      static: [],
      ignore: ["node_modules"],
      pool: [],
    },
    debug: {
      stats: true,
    },
    parser: {
      regexList: [
        {
          name: "main",
          value: "([a-zA-Z]+(_[a-zA-Z0-9]+)+)",
        },
        {
          name: "file",
          value: "((cmp|lib)+(-[a-zA-Z0-9]+)+)",
        },
      ],
    },
    __meta: {
      version: version,
      rcVersion: RC_VERSION,
    },
  } as IOptions;

  return options;
}

export function buildTransformationOptions(options: IOptions): IInternalTransformationOptions {
  return {
    prefix: options.transformation.prefix,
    static: options.transformation.static ?? [],
    ignore: options.transformation.ignore ?? [],
    pool: buildTransformationPoolOption(options.transformation.pool),
  };
}

function buildTransformationPoolOption(pool: string | string[] | undefined): Set<string> {
  if (!pool) {
    return new Set<string>();
  }
  const poolArray = typeof pool === "string" ? pool.split(" ") : pool;

  return new Set<string>(poolArray.filter((e) => e.length >= MIN_POOL_ITEM_LENGTH));
}

export function buildParserOptions(options: IOptions) {
  const ret: IInternalParserOptions = { regexList: [] };

  options.parser.regexList.forEach((e) => {
    ret.regexList.push({ name: e.name, regex: new RegExp(e.value, "g") });
  });
  return ret;
}

export function buildGenerationOptions(options: IOptions): IInternalGenerationOptions {
  return {
    inputDir: options.generation.inputDir,
    outputDir: options.generation.outputDir,
    ignore: buildGenerationIgnoreOptions(options),
  };
}

function buildGenerationIgnoreOptions(options: IOptions) {
  const ret = options.generation.ignore ?? [];
  if (!ret.includes(options.generation.outputDir)) {
    ret.push(options.generation.outputDir);
  }
  return ret;
}

export function buildDebugOptions(options: IOptions): IInternalDebugOptions {
  return {
    stats: typeof options.debug.stats === "boolean" ? options.debug.stats : true,
  };
}
