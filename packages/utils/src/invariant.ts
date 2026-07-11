import { isNullable } from "./typeof";

type Invariant = {
  (condition: boolean, message?: string): asserts condition;
  <Value>(value: Value, message?: string): asserts value is NonNullable<Value>;
};

/**
 * Throws if `condition` is `false`, `null`, or `undefined`. Narrows the
 * checked value afterward, so it doubles as a type guard for assumptions
 * the type system can't verify on its own (e.g. a lookup that must have
 * found a match by this point).
 */
export const invariant: Invariant = (
  value: unknown,
  message = "Invariant failed",
) => {
  if (value === false || isNullable(value)) {
    throw new Error(message);
  }
};
