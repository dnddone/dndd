import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { Button } from "../index";

afterEach(cleanup);

describe("Button", () => {
  it("renders a native button with its children", () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole("button");

    expect(button.tagName).toBe("BUTTON");
    expect(button.textContent).toBe("Click me");
  });

  it("forwards className and arbitrary button props", () => {
    const { getByRole } = render(
      <Button className="cta" type="submit" data-testid="save">
        Go
      </Button>,
    );
    const button = getByRole("button");

    expect(button.className).toBe("cta");
    expect(button.getAttribute("type")).toBe("submit");
    expect(button.getAttribute("data-testid")).toBe("save");
  });

  it("forwards ref to the underlying button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Go</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("sets no loading or disabled wiring in its resting state", () => {
    const { getByRole } = render(<Button>Go</Button>);
    const button = getByRole("button") as HTMLButtonElement;

    expect(button.disabled).toBe(false);
    expect(button.getAttribute("aria-busy")).toBeNull();
    expect(button.getAttribute("aria-disabled")).toBeNull();
    expect(button.getAttribute("data-loading")).toBeNull();
  });

  it("calls onClick when neither loading nor disabled", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<Button onClick={onClick}>Go</Button>);

    fireEvent.click(getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe("when disabled", () => {
    it("natively disables the button and wires aria-disabled", () => {
      const { getByRole } = render(<Button disabled>Go</Button>);
      const button = getByRole("button") as HTMLButtonElement;

      expect(button.disabled).toBe(true);
      expect(button.getAttribute("aria-disabled")).toBe("true");
    });

    it("blocks onClick", () => {
      const onClick = vi.fn();
      const { getByRole } = render(
        <Button disabled onClick={onClick}>
          Go
        </Button>,
      );

      fireEvent.click(getByRole("button"));

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("when loading", () => {
    it("wires busy and disabled ARIA without natively disabling", () => {
      const { getByRole } = render(<Button loading>Go</Button>);
      const button = getByRole("button") as HTMLButtonElement;

      expect(button.getAttribute("aria-busy")).toBe("true");
      expect(button.getAttribute("aria-disabled")).toBe("true");
      expect(button.getAttribute("data-loading")).toBe("true");
      /**
       * Stays focusable (not natively disabled) so it keeps its place in
       * the tab order while busy.
       */
      expect(button.disabled).toBe(false);
    });

    it("blocks onClick", () => {
      const onClick = vi.fn();
      const { getByRole } = render(
        <Button loading onClick={onClick}>
          Go
        </Button>,
      );

      fireEvent.click(getByRole("button"));

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});

describe("Button.Icon", () => {
  it("renders a span slot hidden from assistive tech by default", () => {
    const { getByText } = render(<Button.Icon>icon-content</Button.Icon>);
    const icon = getByText("icon-content");

    expect(icon.tagName).toBe("SPAN");
    expect(icon.getAttribute("data-slot")).toBe("icon");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  it("lets a consumer override aria-hidden", () => {
    const { getByText } = render(
      <Button.Icon aria-hidden={false}>icon-content</Button.Icon>,
    );

    expect(getByText("icon-content").getAttribute("aria-hidden")).toBe("false");
  });
});

describe("Button.Label", () => {
  it("renders a span label slot with its children", () => {
    const { getByText } = render(<Button.Label>Save</Button.Label>);
    const label = getByText("Save");

    expect(label.tagName).toBe("SPAN");
    expect(label.getAttribute("data-slot")).toBe("label");
  });
});

describe("Button.Loader", () => {
  it("renders nothing while the button is not loading", () => {
    const { queryByTestId } = render(
      <Button>
        <Button.Loader data-testid="loader" />
        Go
      </Button>,
    );

    expect(queryByTestId("loader")).toBeNull();
  });

  it("renders a span loader slot while the button is loading", () => {
    const { getByTestId } = render(
      <Button loading>
        <Button.Loader data-testid="loader" />
        Go
      </Button>,
    );
    const loader = getByTestId("loader");

    expect(loader.tagName).toBe("SPAN");
    expect(loader.getAttribute("data-slot")).toBe("loader");
  });

  it("throws when rendered outside a Button", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<Button.Loader />)).toThrow(/within a Button/);

    consoleError.mockRestore();
  });
});
