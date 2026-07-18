import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { Modal } from "../index";

afterEach(cleanup);

const renderModal = (props: Partial<React.ComponentProps<typeof Modal>> = {}) =>
  render(
    <Modal {...props}>
      <Modal.Trigger>Open</Modal.Trigger>
      <Modal.Overlay data-testid="overlay" />
      <Modal.Content aria-label="Example modal">
        <p>Content</p>
        <Modal.Close>Close</Modal.Close>
      </Modal.Content>
    </Modal>,
  );

describe("Modal", () => {
  it("starts closed and opens when the trigger is clicked", () => {
    const { getByRole, queryByRole } = renderModal();

    expect(queryByRole("dialog")).toBeNull();

    fireEvent.click(getByRole("button", { name: "Open" }));

    expect(getByRole("dialog")).toBeTruthy();
  });

  it("wires the trigger's aria-controls to the content's id", () => {
    const { getByRole } = renderModal();
    const trigger = getByRole("button", { name: "Open" });

    fireEvent.click(trigger);
    const dialog = getByRole("dialog");

    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-controls")).toBe(dialog.id);
    expect(dialog.id).toBeTruthy();
  });

  it("reflects open state on the trigger's aria-expanded", () => {
    const { getByRole } = renderModal();
    const trigger = getByRole("button", { name: "Open" });

    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("closes when Modal.Close is clicked", () => {
    const { getByRole, queryByRole } = renderModal();

    fireEvent.click(getByRole("button", { name: "Open" }));
    expect(getByRole("dialog")).toBeTruthy();

    fireEvent.click(getByRole("button", { name: "Close" }));

    expect(queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape", () => {
    const { getByRole, queryByRole } = renderModal();
    const trigger = getByRole("button", { name: "Open" });

    fireEvent.click(trigger);
    const dialog = getByRole("dialog");

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(queryByRole("dialog")).toBeNull();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on an overlay click", () => {
    const { getByRole, getByTestId, queryByRole } = renderModal();

    fireEvent.click(getByRole("button", { name: "Open" }));
    expect(getByRole("dialog")).toBeTruthy();

    fireEvent.click(getByTestId("overlay"));

    expect(queryByRole("dialog")).toBeNull();
  });

  it("does not close on a click that lands on dialog content", () => {
    const { getByRole, getByText } = renderModal();

    fireEvent.click(getByRole("button", { name: "Open" }));
    fireEvent.click(getByText("Content"));

    expect(getByRole("dialog")).toBeTruthy();
  });

  describe("when controlled", () => {
    it("is driven by the open prop and calls onOpenChange instead of managing its own state", () => {
      const onOpenChange = vi.fn();

      const ControlledModal = () => {
        const [open, setOpen] = useState(false);

        return (
          <Modal
            open={open}
            onOpenChange={(nextOpen) => {
              onOpenChange(nextOpen);
              setOpen(nextOpen);
            }}
          >
            <Modal.Trigger>Open</Modal.Trigger>
            <Modal.Content aria-label="Example modal">Content</Modal.Content>
          </Modal>
        );
      };

      const { getByRole } = render(<ControlledModal />);

      fireEvent.click(getByRole("button", { name: "Open" }));

      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(getByRole("dialog")).toBeTruthy();
    });
  });

  describe("outside a Modal", () => {
    it("Modal.Trigger throws", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => render(<Modal.Trigger>Open</Modal.Trigger>)).toThrow(
        /within a Modal/,
      );

      consoleError.mockRestore();
    });

    it("Modal.Content throws", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => render(<Modal.Content>Content</Modal.Content>)).toThrow(
        /within a Modal/,
      );

      consoleError.mockRestore();
    });
  });
});
