import {
  forwardRef,
  useCallback,
  useRef,
  type ComponentPropsWithoutRef,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { isBrowser } from "../utils/isBrowser";
import { useModalContext } from "./ModalContext";
import { usePresence } from "../hooks/usePresence";
import { mergeRefs } from "../utils/mergeRefs";

export type Props = ComponentPropsWithoutRef<"div">;

/**
 * Backdrop behind `Modal.Content`, portaled to the Modal's `container`
 * (default `document.body`). A plain `<div>` — no visual styling of its own —
 * so style and animate it however you like. Carries `data-state="open"` /
 * `"closed"` to drive enter/exit CSS animation, and stays mounted through
 * the exit animation. Clicking it requests close, subject to the Modal's
 * `onOverlayClick` policy.
 */
export const ModalOverlay = forwardRef<HTMLDivElement, Props>(
  ({ onClick, ...props }, ref) => {
    const { open, container, requestOverlayClose } = useModalContext();
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const mounted = usePresence(open, overlayRef);

    const setOverlayRef = useCallback(
      (node: HTMLDivElement | null) => {
        mergeRefs(overlayRef, ref)(node);
      },
      [ref],
    );

    const target = container ?? (isBrowser() ? document.body : null);

    if (!mounted || !target) {
      return null;
    }

    return createPortal(
      <div
        ref={setOverlayRef}
        data-slot="overlay"
        data-state={open ? "open" : "closed"}
        {...props}
        onClick={(event: MouseEvent<HTMLDivElement>) => {
          onClick?.(event);
          requestOverlayClose(event);
        }}
      />,
      target,
    );
  },
);

ModalOverlay.displayName = "Modal.Overlay";
