import { describe, expect, it } from "vitest";
import {
  isArray,
  isBoolean,
  isFunction,
  isNullable,
  isNumber,
  isObject,
  isString,
} from "../typeof";

describe("isBoolean", () => {
  it("is true only for actual booleans", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean("true")).toBe(false);
    expect(isBoolean(0)).toBe(false);
  });
});

describe("isNullable", () => {
  it("is true for null and undefined only", () => {
    expect(isNullable(null)).toBe(true);
    expect(isNullable(undefined)).toBe(true);
    expect(isNullable(0)).toBe(false);
    expect(isNullable("")).toBe(false);
    expect(isNullable(false)).toBe(false);
  });
});

describe("isNumber", () => {
  it("is true for finite numbers", () => {
    expect(isNumber(42)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-3.5)).toBe(true);
  });

  it("is false for non-finite numbers", () => {
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber(Infinity)).toBe(false);
    expect(isNumber(-Infinity)).toBe(false);
  });

  it("accepts finite numeric strings", () => {
    expect(isNumber("42")).toBe(true);
    expect(isNumber("-3.5")).toBe(true);
    expect(isNumber("  ")).toBe(false);
    expect(isNumber("abc")).toBe(false);
    expect(isNumber("")).toBe(false);
  });

  it("is false for other types", () => {
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber({})).toBe(false);
  });
});

describe("isObject", () => {
  it("is true for plain objects", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
  });

  it("excludes arrays and null", () => {
    expect(isObject([1, 2])).toBe(false);
    expect(isObject(null)).toBe(false);
  });

  it("is false for primitives", () => {
    expect(isObject("hi")).toBe(false);
    expect(isObject(42)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });
});

describe("isString", () => {
  it("is true for string primitives and boxed String instances", () => {
    expect(isString("hi")).toBe(true);
    expect(isString(new String("hi"))).toBe(true);
  });

  it("is false for non-strings", () => {
    expect(isString(42)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });
});

describe("isArray", () => {
  it("is true for arrays", () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
  });

  it("is false for non-arrays", () => {
    expect(isArray({})).toBe(false);
    expect(isArray("array")).toBe(false);
    expect(isArray(null)).toBe(false);
  });
});

describe("isFunction", () => {
  it("is true for functions", () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function named() {})).toBe(true);
    expect(isFunction(class {})).toBe(true);
  });

  it("is false for non-functions", () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction("function")).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
  });
});
