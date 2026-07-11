import { forwardRef, type ComponentPropsWithoutRef } from "react";

export type Props = ComponentPropsWithoutRef<"span">;

/**
 * Optional wrapper for Button's text. Marks it with `data-slot="label"` so
 * it can be hidden with your own CSS while loading, e.g.
 * `button[data-loading] [data-slot="label"] { visibility: hidden }`. Only
 * needed when pairing with `Button.Loader` to fully replace the text —
 * plain text children work fine otherwise.
 */
export const ButtonLabel = forwardRef<HTMLSpanElement, Props>((props, ref) => (
  <span ref={ref} data-slot="label" {...props} />
));

ButtonLabel.displayName = "Button.Label";
