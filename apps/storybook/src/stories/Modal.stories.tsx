import { useState } from "react";
import { Modal } from "@dndd/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Demo-only styling for the Storybook catalog — @dndd/react itself ships
 * unstyled.
 */
const triggerClassName =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-colors duration-150 hover:border-blue-300 hover:bg-blue-100 active:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 cursor-pointer";

const overlayClassName = "fixed inset-0 bg-gray-900/50";

const contentClassName =
  "fixed inset-0 m-auto h-fit w-80 max-w-full rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-lg";

const closeClassName =
  "mt-4 inline-flex items-center justify-center rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer";

const meta = {
  title: "Modal",
  component: Modal,
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => (
    <Modal>
      <Modal.Trigger className={triggerClassName}>Open modal</Modal.Trigger>
      <Modal.Overlay className={overlayClassName} />
      <Modal.Content aria-label="Example modal" className={contentClassName}>
        <h2 className="text-lg font-semibold">Modal title</h2>
        <p className="mt-2 text-sm text-gray-600">
          Focus trapping, Esc-to-close, and overlay-click dismissal are wired in
          — no visual styling is applied by the package itself.
        </p>
        <Modal.Close className={closeClassName}>Close</Modal.Close>
      </Modal.Content>
    </Modal>
  ),
};

/**
 * Controlled open state — this story owns `open`/`onOpenChange` itself
 * instead of letting Modal manage it, e.g. to drive the modal from a route
 * or an external event.
 */
export const Controlled: Story = {
  render: function ControlledModal() {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-gray-600">Open: {String(open)}</p>
        <Modal open={open} onOpenChange={setOpen}>
          <Modal.Trigger className={triggerClassName}>Open modal</Modal.Trigger>
          <Modal.Overlay className={overlayClassName} />
          <Modal.Content
            aria-label="Controlled example modal"
            className={contentClassName}
          >
            <h2 className="text-lg font-semibold">Controlled modal</h2>
            <p className="mt-2 text-sm text-gray-600">
              The parent&apos;s own state drives `open`.
            </p>
            <Modal.Close className={closeClassName}>Close</Modal.Close>
          </Modal.Content>
        </Modal>
      </div>
    );
  },
};
