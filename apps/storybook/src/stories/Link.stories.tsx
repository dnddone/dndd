import { Link } from "@dndd/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
    className: { control: false, table: { disable: true } },
  },
  render: (args) => <Link {...args} className={linkClassName} />,
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = {
  args: {
    href: "https://example.com",
    children: "External site",
  },
};

export const Mailto: Story = {
  args: {
    href: "mailto:hello@example.com",
    children: "Email us",
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <Link {...args} className={linkClassName}>
      {args.children}
      <Link.Icon>→</Link.Icon>
    </Link>
  ),
};
