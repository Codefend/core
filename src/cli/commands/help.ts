import { CLI_OPTIONS, HELP_COMMAND_INTRO } from "../../core/utils/constants.js";

export function helpCommand(): void {
  const longest = Math.max(...CLI_OPTIONS.map((el) => el.long.length));
  const offset = 2;
  let ret = HELP_COMMAND_INTRO;
  CLI_OPTIONS.forEach((e) => {
    ret += `\n  ${e.short}, ${e.long.padEnd(longest + offset, " ")}${e.description}`;
  });

  console.log(ret);
}
