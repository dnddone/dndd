import { forwardRef } from "react";
import { Button, type Props as ButtonProps } from "../Button/Button";
import { useModalContext } from "./ModalContext";

export type Props = ButtonProps;

/**
 * Closes the enclosing Modal. Renders `@dndd/react`'s `Button` — no visual
 * styling or default content (e.g. an "×" icon) is applied. Optional: omit
 * it entirely and the modal simply has no in-panel close affordance. A
 * consumer `onClick` runs first and can `preventDefault` to stop the close.
 */
export const ModalClose = forwardRef<HTMLButtonElement, Props>(
  ({ onClick, ...props }, ref) => {
    const { setOpen } = useModalContext();

    return (
      <Button
        ref={ref}
        type="button"
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented) {
            setOpen(false);
          }
        }}
        {...props}
      />
    );
  },
);

ModalClose.displayName = "Modal.Close";
