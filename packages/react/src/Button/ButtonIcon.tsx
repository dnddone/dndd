import { forwardRef, type ComponentPropsWithoutRef } from "react";

export type Props = ComponentPropsWithoutRef<"span">;

/**
 * Decorative icon slot for Button. Positions itself via JSX order relative
 * to the button's other children — render it before the label for a
 * leading icon, after for a trailing one. Hidden from assistive tech by
 * default; pass your own `aria-hidden` to override.
 */
export const ButtonIcon = forwardRef<HTMLSpanElement, Props>(
  ({ "aria-hidden": ariaHidden = true, ...props }, ref) => (
    <span ref={ref} data-slot="icon" aria-hidden={ariaHidden} {...props} />
  ),
);

ButtonIcon.displayName = "Button.Icon";
