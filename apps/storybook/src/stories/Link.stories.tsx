import { Link } from "@dndd/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { forwardRef, type AnchorHTMLAttributes } from "react";

/**
 * Lightweight stand-ins for react-router-dom's `Link` (`to` prop) and
 * Next.js's `Link` (`href` prop), just to demo passing a router component via
 * `as` without pulling either framework into this Storybook app as a
 * dependency.
 */
type RouterLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
};

const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  ({ to, ...props }, ref) => <a ref={ref} href={to} {...props} />,
);
RouterLink.displayName = "RouterLink";

const NextLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>((props, ref) => <a ref={ref} {...props} />);
NextLink.displayName = "NextLink";

/**
 * Demo-only styling for the Storybook catalog — @dndd/react itself ships
 * unstyled.
 */
const linkClassName =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 no-underline shadow-sm transition-colors duration-150 hover:border-blue-300 hover:bg-blue-100 active:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2";

const meta = {
  title: "Link",
  component: Link,
  tags: ["autodocs"],
  args: {
    href: "/about",
    children: "About us",
  },
  argTypes: {
    external: { control: "boolean" },
    className: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
  },
  render: (args) => <Link {...args} className={linkClassName} />,
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {};

export const WithIcon: Story = {
  render: (args) => (
    <Link {...args} className={linkClassName}>
      {args.children}
      <Link.Icon>→</Link.Icon>
    </Link>
  ),
};

/**
 * Destinations that get the external-link treatment (target="_blank",
 * rel="noopener noreferrer", data-external) — automatically for absolute
 * URLs and mailto:/tel: links, or explicitly via `external` for an internal
 * destination that should still open in a new tab.
 */
export const External: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Link className={linkClassName} href="https://example.com">
        External site
      </Link>
      <Link className={linkClassName} href="mailto:hello@example.com">
        Email us
      </Link>
      <Link className={linkClassName} href="tel:+15555555555">
        Call us
      </Link>
      <Link className={linkClassName} href="/dashboard" external>
        Open dashboard in new tab
      </Link>
    </div>
  ),
};

/**
 * Passing a router's own Link via `as` — react-router-dom's Link (`to` prop)
 * or Next.js's Link (`href` prop) — so navigation goes through the router
 * instead of a full page load. `RouterLink`/`NextLink` here are demo
 * stand-ins matching each library's real API shape.
 */
export const WithRouter: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Link className={linkClassName} as={RouterLink} to="/dashboard">
        react-router-dom Link
      </Link>
      <Link className={linkClassName} as={NextLink} href="/dashboard">
        Next.js Link
      </Link>
    </div>
  ),
};
