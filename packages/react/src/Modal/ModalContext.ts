import { createContext, useContext, type MouseEvent } from "react";
import { invariant } from "@dndd/utils";

type ModalContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  /**
   * Portal target for Overlay and Content. `null` falls back to
   * `document.body` at render time.
   */
  container: Element | null;
  /**
   * Runs the modal's overlay-click dismissal policy — calls the consumer's
   * `onOverlayClick` then closes unless it was `preventDefault`-ed.
   */
  requestOverlayClose: (event: MouseEvent) => void;
  /**
   * Runs the modal's Escape dismissal policy — calls the consumer's
   * `onEscapeKeyDown` then closes unless it was `preventDefault`-ed.
   */
  requestEscapeClose: (event: KeyboardEvent) => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);

  invariant(
    context,
    "Modal.Trigger, Modal.Overlay, Modal.Content, and Modal.Close must be used within a Modal",
  );

  return context;
};
