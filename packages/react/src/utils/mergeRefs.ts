import type { Ref } from "react";
import { isFunction } from "@dndd/utils";

/**
 * Combines several refs into one callback ref, so a forwarded ref and an
 * internal ref can both point at the same node. Handles both callback and
 * object refs.
 */
export const mergeRefs = <Value>(...refs: Array<Ref<Value> | undefined>) => {
  return (node: Value | null) => {
    for (const ref of refs) {
      if (isFunction(ref)) {
        ref(node);
      } else if (ref) {
        (ref as { current: Value | null }).current = node;
      }
    }
  };
};
