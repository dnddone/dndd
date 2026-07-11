import { describe, expect, it } from "vitest";
import { invariant } from "../invariant";

describe("invariant", () => {
  it("does not throw for a truthy condition", () => {
    expect(() => invariant(true)).not.toThrow();
    expect(() => invariant("ok")).not.toThrow();
    expect(() => invariant(1)).not.toThrow();
    expect(() => invariant(0)).not.toThrow();
  });

  it("throws for false, null, or undefined", () => {
    expect(() => invariant(false)).toThrow("Invariant failed");
    expect(() => invariant(null)).toThrow("Invariant failed");
    expect(() => invariant(undefined)).toThrow("Invariant failed");
  });

  it("throws with a custom message", () => {
    expect(() => invariant(false, "post must exist")).toThrow(
      "post must exist",
    );
  });

  it("narrows a nullable value for TypeScript after the call", () => {
    const value: string | null = "hello";
    invariant(value);
    const upper: string = value.toUpperCase();
    expect(upper).toBe("HELLO");
  });
});
