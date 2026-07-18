import { useCallback, useState } from "react";

type Options<Value> = {
  value?: Value;
  defaultValue: Value;
  onChange?: (value: Value) => void;
};

/**
 * Backs a component's state with either a controlled prop or its own
 * uncontrolled state, without the component itself needing to know which
 * mode it's in. Controlled mode is entered by passing `value` (any value,
 * including `undefined` for the type — only omitting the prop entirely
 * falls back to uncontrolled).
 */
export const useControllableState = <Value>({
  value,
  defaultValue,
  onChange,
}: Options<Value>): [Value, (value: Value) => void] => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;

  const setValue = useCallback(
    (nextValue: Value) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [isControlled, onChange],
  );

  return [currentValue, setValue];
};
