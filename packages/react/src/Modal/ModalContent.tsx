import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";
import { createPortal } from "react-dom";
import { isBrowser } from "../utils/isBrowser";
import { useModalContext } from "./ModalContext";
import { usePresence } from "../hooks/usePresence";
import { mergeRefs } from "../utils/mergeRefs";

export type Props = ComponentPropsWithoutRef<"div">;

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const getFocusable = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

/**
 * The modal panel, portaled to the Modal's `container` (default
 * `document.body`) so it's free of any parent stacking context, `overflow`,
 * or `transform`. Renders a `role="dialog"` `aria-modal` `<div>` — no visual
 * styling of its own, so position and animate it yourself (it centers
 * nothing for you). While open it traps focus, moves focus inside on open
 * and restores it to the trigger on close, and closes on Esc subject to the
 * Modal's `onEscapeKeyDown` policy. Carries `data-state="open"` / `"closed"`
 * and stays mounted through the exit animation.
 */
export const ModalContent = forwardRef<HTMLDivElement, Props>(
  ({ id, tabIndex, ...props }, ref) => {
    const { open, contentId, container, requestEscapeClose } =
      useModalContext();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const mounted = usePresence(open, contentRef);

    /**
     * Read through a ref inside the keydown effect below so an inline
     * `onOpenChange` (which gives `requestEscapeClose` a new identity every
     * render) can't force that effect to tear down and re-run while open —
     * doing so would refocus the first focusable element mid-interaction.
     */
    const requestEscapeCloseRef = useRef(requestEscapeClose);
    requestEscapeCloseRef.current = requestEscapeClose;

    useEffect(() => {
      /**
       * `mounted` gates re-running once the portal is actually in the DOM:
       * usePresence mounts the content a render after `open` flips true, so
       * keying on `open` alone would run this while contentRef is still null.
       */
      if (!open || !mounted) {
        return;
      }

      const content = contentRef.current;

      if (!content) {
        return;
      }

      const previouslyFocused = document.activeElement as HTMLElement | null;
      const initialFocusable = getFocusable(content);
      (initialFocusable[0] ?? content).focus();

      return () => {
        previouslyFocused?.focus?.();
      };
    }, [open, mounted]);

    useEffect(() => {
      if (!open || !mounted) {
        return;
      }

      const content = contentRef.current;

      if (!content) {
        return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          requestEscapeCloseRef.current(event);
          return;
        }

        if (event.key !== "Tab") {
          return;
        }

        const focusables = getFocusable(content);

        if (focusables.length === 0) {
          event.preventDefault();
          content.focus();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [open, mounted]);

    const setContentRef = useCallback(
      (node: HTMLDivElement | null) => {
        mergeRefs(contentRef, ref)(node);
      },
      [ref],
    );

    const target = container ?? (isBrowser() ? document.body : null);

    if (!mounted || !target) {
      return null;
    }

    return createPortal(
      <div
        ref={setContentRef}
        role="dialog"
        aria-modal="true"
        id={id ?? contentId}
        tabIndex={tabIndex ?? -1}
        data-slot="content"
        data-state={open ? "open" : "closed"}
        {...props}
      />,
      target,
    );
  },
);

ModalContent.displayName = "Modal.Content";
