import { PARSER_NAMES } from "../core/utils/constants";

export type IParserNames = keyof typeof PARSER_NAMES | "custom";
