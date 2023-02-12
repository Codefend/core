import chalk from "chalk";
import { LOG_OPTIONS } from "./constants";

export function newLine() {
  console.log("");
}

export const debug = (
  prefix: string,
  message: string,
  debug: boolean,
  logFunction: (prefix: string, message: string) => void
) => {
  if (!debug) return;
  logFunction(prefix, message);
};

export const info = (prefix: string, message: string) => {
  console.log(buildPrefixColor()(buildPrefix(prefix)) + buildMessageColor("info")(buildMessage(message)));
};
export const success = (prefix: string, message: string) => {
  console.log(buildPrefixColor()(buildPrefix(prefix)) + buildMessageColor("success")(buildMessage(message)));
};
export const warning = (prefix: string, message: string) => {
  console.log(buildPrefixColor()(buildPrefix(prefix)) + buildMessageColor("warning")(buildMessage(message)));
};
export const error = (prefix: string, message: string) => {
  console.log(buildPrefixColor()(buildPrefix(prefix)) + buildMessageColor("error")(buildMessage(message)));
};

function buildPrefix(prefix: string) {
  return ` ${prefix.padEnd(LOG_OPTIONS.PREFIX_SIZE, " ")}`;
}

function buildMessage(message: string) {
  return ` ${message.padEnd(LOG_OPTIONS.MESSAGE_SIZE, " ")}`;
}

function buildPrefixColor() {
  return chalk.hex(LOG_OPTIONS.COLORS.PREFIX_FG).bgHex(LOG_OPTIONS.COLORS.PREFIX_BG).bold;
}

function buildMessageColor(type: string) {
  switch (type) {
    case "info":
      return chalk.hex("#fafafa").bgHex(LOG_OPTIONS.COLORS.PREFIX_BG);
    case "warning":
      return chalk.bgYellow.hex(LOG_OPTIONS.COLORS.PREFIX_BG);
    case "error":
      return chalk.bgRed.hex(LOG_OPTIONS.COLORS.PREFIX_BG);
    case "success":
    default:
      return chalk.bgGreen.hex(LOG_OPTIONS.COLORS.PREFIX_BG);
  }
}
