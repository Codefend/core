import { getUnknownOptionMessage } from "../../core/utils/constants.js";

export function unknownCommand(option: string): void {
  console.log(getUnknownOptionMessage(option));
}
