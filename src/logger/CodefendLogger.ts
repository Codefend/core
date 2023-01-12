import chalk from "chalk";
import { ICodefendOptions } from "../core/options/ICodefendOptions";
import { LOG_OPTIONS } from "./../utils/Constants";
import { ICodefendLogger } from "./ICodefendLogger";

export class CodefendLogger implements ICodefendLogger {
  options: ICodefendOptions;

  constructor(options: ICodefendOptions) {
    this.options = options;
  }
  newLine() {
    console.log("");
  }

  debug(prefix: string, message: string, debug: boolean) {
    if (!debug) return;
    this.info(prefix, message);
  }

  info(prefix: string, message: string) {
    console.log(
      this.buildPrefixColor()(this.buildPrefix(prefix)) +
        this.buildMessageColor("info")(this.buildMessage(message))
    );
  }
  success(prefix: string, message: string) {
    console.log(
      this.buildPrefixColor()(this.buildPrefix(prefix)) +
        this.buildMessageColor("success")(this.buildMessage(message))
    );
  }
  warning(prefix: string, message: string) {
    console.log(
      this.buildPrefixColor()(this.buildPrefix(prefix)) +
        this.buildMessageColor("warning")(this.buildMessage(message))
    );
  }
  error(prefix: string, message: string) {
    console.log(
      this.buildPrefixColor()(this.buildPrefix(prefix)) +
        this.buildMessageColor("error")(this.buildMessage(message))
    );
  }

  buildPrefix(prefix: string) {
    return ` ${prefix.padEnd(LOG_OPTIONS.PREFIX_SIZE, " ")}`;
  }

  buildMessage(message: string) {
    return ` ${message.padEnd(LOG_OPTIONS.MESSAGE_SIZE, " ")}`;
  }

  buildPrefixColor() {
    return chalk
      .hex(LOG_OPTIONS.COLORS.PREFIX_FG)
      .bgHex(LOG_OPTIONS.COLORS.PREFIX_BG).bold;
  }

  buildMessageColor(type: string) {
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

  setOptions(options: ICodefendOptions) {
    this.options = options;
  }
}
