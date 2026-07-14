import { createRef, forwardRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Link } from "../index";

afterEach(cleanup);

const FakeRouterLink = forwardRef<
  HTMLAnchorElement,
  { to: string; children?: React.ReactNode }
>(({ to, children }, ref) => (
  <a ref={ref} href={to} data-router-link="">
    {children}
  </a>
));
FakeRouterLink.displayName = "FakeRouterLink";

describe("Link", () => {
  it("renders a native anchor by default", () => {
    const { getByRole } = render(<Link href="/about">About</Link>);
    const link = getByRole("link");

    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/about");
  });

  it("forwards className and arbitrary anchor props", () => {
    const { getByRole } = render(
      <Link href="/about" className="nav-link" data-testid="about-link">
        About
      </Link>,
    );
    const link = getByRole("link");

    expect(link.className).toBe("nav-link");
    expect(link.getAttribute("data-testid")).toBe("about-link");
  });

  it("forwards ref to the underlying anchor", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link href="/about" ref={ref}>
        About
      </Link>,
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it("renders the component passed via `as` for an internal destination", () => {
    const { getByRole } = render(
      <Link as={FakeRouterLink} to="/dashboard">
        Dashboard
      </Link>,
    );
    const link = getByRole("link");

    expect(link.getAttribute("data-router-link")).toBe("");
    expect(link.getAttribute("href")).toBe("/dashboard");
  });

  describe("when the destination is external", () => {
    it("ignores `as` and renders a native anchor", () => {
      const { getByRole } = render(
        <Link as={FakeRouterLink} to="https://example.com">
          Example
        </Link>,
      );
      const link = getByRole("link");

      expect(link.hasAttribute("data-router-link")).toBe(false);
      expect(link.getAttribute("href")).toBe("https://example.com");
    });

    it("sets target and rel for security, plus a data-external hook", () => {
      const { getByRole } = render(
        <Link href="https://example.com">Example</Link>,
      );
      const link = getByRole("link");

      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.getAttribute("data-external")).toBe("true");
    });

    it("lets a consumer override target and rel", () => {
      const { getByRole } = render(
        <Link href="https://example.com" target="_self" rel="noopener">
          Example
        </Link>,
      );
      const link = getByRole("link");

      expect(link.getAttribute("target")).toBe("_self");
      expect(link.getAttribute("rel")).toBe("noopener");
    });

    it("treats a protocol-relative destination as external", () => {
      const { getByRole } = render(<Link href="//example.com">Example</Link>);

      expect(getByRole("link").getAttribute("data-external")).toBe("true");
    });

    it("treats a mailto destination as external", () => {
      const { getByRole } = render(
        <Link href="mailto:hi@example.com">Email</Link>,
      );

      expect(getByRole("link").getAttribute("data-external")).toBe("true");
    });

    it("treats a tel destination as external", () => {
      const { getByRole } = render(<Link href="tel:+15555555555">Call</Link>);

      expect(getByRole("link").getAttribute("data-external")).toBe("true");
    });
  });

  it("treats a relative path as internal", () => {
    const { getByRole } = render(<Link href="/about">About</Link>);
    const link = getByRole("link");

    expect(link.hasAttribute("data-external")).toBe(false);
    expect(link.getAttribute("target")).toBeNull();
  });

  describe("when `external` is set on an internal destination", () => {
    it("ignores `as` and renders a native anchor", () => {
      const { getByRole } = render(
        <Link as={FakeRouterLink} to="/dashboard" external>
          Dashboard
        </Link>,
      );
      const link = getByRole("link");

      expect(link.hasAttribute("data-router-link")).toBe(false);
      expect(link.getAttribute("href")).toBe("/dashboard");
    });

    it("sets target, rel, and data-external", () => {
      const { getByRole } = render(
        <Link href="/dashboard" external>
          Dashboard
        </Link>,
      );
      const link = getByRole("link");

      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.getAttribute("data-external")).toBe("true");
    });
  });
});

describe("Link.Icon", () => {
  it("renders an icon slot inside the anchor", () => {
    const { getByRole, getByText } = render(
      <Link href="/about">
        <Link.Icon>icon-content</Link.Icon>
        About
      </Link>,
    );
    const link = getByRole("link");
    const icon = getByText("icon-content");

    expect(link.contains(icon)).toBe(true);
    expect(icon.tagName).toBe("SPAN");
    expect(icon.getAttribute("data-slot")).toBe("icon");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });
});
