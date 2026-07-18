import { Modal as ModalRoot } from "./Modal";
import { ModalTrigger } from "./ModalTrigger";
import { ModalOverlay } from "./ModalOverlay";
import { ModalContent } from "./ModalContent";
import { ModalClose } from "./ModalClose";

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Overlay: ModalOverlay,
  Content: ModalContent,
  Close: ModalClose,
});

export type { Props as ModalProps, ModalRef } from "./Modal";
export type { Props as ModalTriggerProps } from "./ModalTrigger";
export type { Props as ModalOverlayProps } from "./ModalOverlay";
export type { Props as ModalContentProps } from "./ModalContent";
export type { Props as ModalCloseProps } from "./ModalClose";
