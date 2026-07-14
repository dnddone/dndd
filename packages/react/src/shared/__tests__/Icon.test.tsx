import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Icon } from "../Icon";

afterEach(cleanup);

describe("Icon", () => {
  it("renders a span slot marked with data-slot", () => {
    const { getByText } = render(<Icon>icon-content</Icon>);
    const icon = getByText("icon-content");

    expect(icon.tagName).toBe("SPAN");
    expect(icon.getAttribute("data-slot")).toBe("icon");
  });

  it("is hidden from assistive tech by default", () => {
    const { getByText } = render(<Icon>icon-content</Icon>);

    expect(getByText("icon-content").getAttribute("aria-hidden")).toBe("true");
  });

  it("lets a consumer override aria-hidden", () => {
    const { getByText } = render(<Icon aria-hidden={false}>icon-content</Icon>);

    expect(getByText("icon-content").getAttribute("aria-hidden")).toBe("false");
  });

  it("forwards className and arbitrary span props", () => {
    const { getByText } = render(
      <Icon className="icon-class" data-testid="icon-slot">
        icon-content
      </Icon>,
    );
    const icon = getByText("icon-content");

    expect(icon.className).toBe("icon-class");
    expect(icon.getAttribute("data-testid")).toBe("icon-slot");
  });

  it("forwards ref to the underlying span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Icon ref={ref}>icon-content</Icon>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
