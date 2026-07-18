import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useControllableState } from "../useControllableState";

describe("useControllableState", () => {
  describe("when uncontrolled", () => {
    it("starts at defaultValue and updates its own state", () => {
      const { result } = renderHook(() =>
        useControllableState({ defaultValue: false }),
      );

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });

    it("calls onChange with the next value", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllableState({ defaultValue: false, onChange }),
      );

      act(() => {
        result.current[1](true);
      });

      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe("when controlled", () => {
    it("reflects the passed value instead of internal state", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useControllableState({ value, defaultValue: false }),
        { initialProps: { value: false } },
      );

      expect(result.current[0]).toBe(false);

      rerender({ value: true });

      expect(result.current[0]).toBe(true);
    });

    it("calls onChange but does not change its own state", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllableState({ value: false, defaultValue: false, onChange }),
      );

      act(() => {
        result.current[1](true);
      });

      expect(onChange).toHaveBeenCalledWith(true);
      expect(result.current[0]).toBe(false);
    });
  });
});
