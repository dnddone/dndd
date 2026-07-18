import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  type MouseEvent,
  type ReactNode,
} from "react";
import { isBrowser } from "../utils/isBrowser";
import { useControllableState } from "../hooks/useControllableState";
import { ModalContext } from "./ModalContext";

export type Props = {
  /**
   * Controlled open state. Omit entirely to let Modal manage its own state
   * (defaulting to `defaultOpen`) — pass this for controlled use, e.g.
   * driving the modal from a route or external event.
   */
  open?: boolean;
  /**
   * Initial open state in uncontrolled mode. Ignored when `open` is passed.
   */
  defaultOpen?: boolean;
  /**
   * Called whenever the modal's open state changes, whether triggered by
   * `Modal.Trigger`/`Modal.Close`, the Esc key, or an overlay click.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Where `Modal.Overlay` and `Modal.Content` portal to. Defaults to
   * `document.body`, so the modal escapes any parent stacking context,
   * `overflow`, or `transform`.
   */
  container?: Element | null;
  /**
   * Fires on an overlay (outside) click before the modal closes. Call
   * `event.preventDefault()` to block the close — this is how outside-click
   * dismissal is conditionally disabled.
   */
  onOverlayClick?: (event: MouseEvent) => void;
  /**
   * Fires on the Esc key before the modal closes. Call
   * `event.preventDefault()` to block the close — this is how Esc dismissal
   * is conditionally disabled.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  children?: ReactNode;
};

export type ModalRef = {
  open: () => void;
  close: () => void;
};

/**
 * Headless modal root. Renders no DOM of its own — it holds open/close
 * state (controlled or uncontrolled), locks body scroll while open, and
 * exposes state plus dismissal policy via context to `Modal.Trigger`,
 * `Modal.Overlay`, `Modal.Content`, and `Modal.Close`. `Overlay`/`Content`
 * portal to `container` (default `document.body`), so the modal doesn't
 * depend on where it sits in the tree. No visual styling is applied.
 *
 * A ref gives imperative `open()`/`close()` methods, for triggering the
 * modal from code that doesn't want to lift state (e.g. a deeply nested
 * handler) — `open`/`onOpenChange` remain the way to drive it from state
 * you already own.
 */
export const Modal = forwardRef<ModalRef, Props>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      container = null,
      onOverlayClick,
      onEscapeKeyDown,
      children,
    },
    ref,
  ) => {
    const contentId = useId();
    const [isOpen, setIsOpen] = useControllableState({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    useImperativeHandle(
      ref,
      () => ({
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }),
      [setIsOpen],
    );

    useEffect(() => {
      if (!isOpen || !isBrowser()) {
        return;
      }

      const { body } = document;
      const originalOverflow = body.style.overflow;
      body.style.overflow = "hidden";

      return () => {
        body.style.overflow = originalOverflow;
      };
    }, [isOpen]);

    const requestOverlayClose = useCallback(
      (event: MouseEvent) => {
        onOverlayClick?.(event);

        if (!event.defaultPrevented) {
          setIsOpen(false);
        }
      },
      [onOverlayClick, setIsOpen],
    );

    const requestEscapeClose = useCallback(
      (event: KeyboardEvent) => {
        onEscapeKeyDown?.(event);

        if (!event.defaultPrevented) {
          setIsOpen(false);
        }
      },
      [onEscapeKeyDown, setIsOpen],
    );

    const value = useMemo(
      () => ({
        open: isOpen,
        setOpen: setIsOpen,
        contentId,
        container,
        requestOverlayClose,
        requestEscapeClose,
      }),
      [
        isOpen,
        setIsOpen,
        contentId,
        container,
        requestOverlayClose,
        requestEscapeClose,
      ],
    );

    return (
      <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
    );
  },
);

Modal.displayName = "Modal";
