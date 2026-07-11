import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { useButtonContext } from "./ButtonContext";

export type Props = ComponentPropsWithoutRef<"span">;

/**
 * Loading indicator slot for Button. Renders nothing unless the parent
 * Button's `loading` prop is true. Position it via JSX order — before the
 * label for a leading spinner alongside the text, or paired with
 * `Button.Label` to fully replace the text while loading.
 */
export const ButtonLoader = forwardRef<HTMLSpanElement, Props>((props, ref) => {
  const { loading } = useButtonContext();

  if (!loading) {
    return null;
  }

  return <span ref={ref} data-slot="loader" {...props} />;
});

ButtonLoader.displayName = "Button.Loader";
