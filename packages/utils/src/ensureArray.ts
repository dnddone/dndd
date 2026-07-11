import { isArray } from "./typeof";

/**
 * Wraps a single value in an array; returns the value unchanged if it's
 * already an array.
 */
export const ensureArray = <Value = string>(input: Value | Value[]): Value[] =>
  isArray<Value>(input) ? input : [input];
