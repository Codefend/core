import { CODEFEND_CHECK_ERROR_CODES, CODEFEND_CHECK_WARNING_CODES } from "../core/utils/constants";

export type ICheckErrorCodes = keyof typeof CODEFEND_CHECK_ERROR_CODES;

export type ICheckWarningCodes = keyof typeof CODEFEND_CHECK_WARNING_CODES;

export type IStringModifierFunction = (word: string) => string;