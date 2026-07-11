import { describe, expect, it } from "vitest";
import { ensureArray } from "../ensureArray";

describe("ensureArray", () => {
  it("wraps a single value in an array", () => {
    expect(ensureArray("a")).toEqual(["a"]);
    expect(ensureArray(1)).toEqual([1]);
  });

  it("returns an array unchanged", () => {
    expect(ensureArray(["a", "b"])).toEqual(["a", "b"]);
    expect(ensureArray([])).toEqual([]);
  });

  it("wraps null and undefined instead of treating them as empty", () => {
    expect(ensureArray(null)).toEqual([null]);
    expect(ensureArray(undefined)).toEqual([undefined]);
  });
});
