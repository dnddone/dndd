import { forwardRef, type ComponentPropsWithoutRef } from "react";

export type Props = ComponentPropsWithoutRef<"span">;

/**
 * Decorative icon slot shared by compound components (Button.Icon,
 * Link.Icon, ...). Positions itself via JSX order relative to sibling
 * children — render it before the label/children for a leading icon,
 * after for a trailing one. Hidden from assistive tech by default; pass
 * your own `aria-hidden` to override.
 */
export const Icon = forwardRef<HTMLSpanElement, Props>(
  ({ "aria-hidden": ariaHidden = true, ...props }, ref) => (
    <span ref={ref} data-slot="icon" aria-hidden={ariaHidden} {...props} />
  ),
);

Icon.displayName = "Icon";
