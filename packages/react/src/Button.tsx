import { forwardRef, type ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * When true the button announces itself as busy (`aria-busy`) and blocks
   * activation — including keyboard Enter/Space — without leaving the tab
   * order. Headless: render your own spinner off `data-loading`/`aria-busy`.
   */
  loading?: boolean;
};

/**
 * Headless button. Renders a native <button>, forwards className and every
 * other button attribute, and manages the loading/disabled a11y contract.
 * No visual styling is applied.
 */
export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ loading = false, disabled = false, onClick, children, ...props }, ref) => {
    const isInteractionBlocked = loading || disabled;

    return (
      <button
        ref={ref}
        disabled={disabled}
        aria-busy={loading || undefined}
        aria-disabled={isInteractionBlocked || undefined}
        data-loading={loading || undefined}
        onClick={(event) => {
          if (isInteractionBlocked) {
            event.preventDefault();
            return;
          }

          onClick?.(event);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
