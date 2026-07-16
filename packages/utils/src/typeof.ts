export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const isNullable = (value: unknown): value is null | undefined =>
  value === undefined || value === null;

export const isNumber = (value: unknown): value is number => {
  if (typeof value === "number") {
    return value - value === 0;
  }

  if (typeof value === "string" && value.trim() !== "") {
    return Number.isFinite(+value);
  }

  return false;
};

export const isObject = (value: unknown): value is object =>
  typeof value === "object" && value !== null && Array.isArray(value) === false;

export const isString = (value: unknown): value is string =>
  typeof value === "string" || value instanceof String;

export const isArray = <T = unknown>(value: unknown): value is T[] =>
  Array.isArray(value);

export const isFunction = <T extends (...args: never[]) => unknown>(
  value: T | unknown,
): value is T => typeof value === "function";
