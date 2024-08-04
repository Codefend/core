import { CODEFEND_CHECK_ERROR, CODEFEND_CHECK_WARNING } from "../core/utils/constants";

export type ICheckResult = {
  code: ICheckErrorCodeValues | ICheckWarningCodeValues;
  message: string;
};

export type ICheckResults = {
  warnings: ICheckResult[];
  errors: ICheckResult[];
};

type ICheckError = typeof CODEFEND_CHECK_ERROR;
type ICheckErrorCodes = {
  [K in keyof ICheckError]: ICheckError[K]["code"];
};
export type ICheckErrorCodeValues = ICheckErrorCodes[keyof ICheckErrorCodes];

type ICheckWarning = typeof CODEFEND_CHECK_WARNING;
type ICheckWarningCodes = {
  [K in keyof ICheckWarning]: ICheckWarning[K]["code"];
};
export type ICheckWarningCodeValues = ICheckWarningCodes[keyof ICheckWarningCodes];
