import { Button } from "@dndd/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Demo-only styling for the Storybook catalog — @dndd/react itself ships
 * unstyled.
 */
const buttonClassName =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 enabled:not-data-[loading]:hover:border-blue-300 enabled:not-data-[loading]:hover:bg-blue-100 enabled:not-data-[loading]:active:bg-blue-200 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:shadow-none cursor-pointer";

const spinnerClassName =
  "size-4 animate-spin rounded-full border-2 border-current border-t-transparent";

const meta = {
  title: "Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
    loading: false,
    disabled: false,
  },
  argTypes: {
    children: { control: false, table: { disable: true } },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    className: { control: false, table: { disable: true } },
  },
  render: (args) => <Button {...args} className={buttonClassName} />,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {};

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      <Button {...args} className={buttonClassName}>
        <Button.Icon>★</Button.Icon>
        {args.children}
      </Button>
      <Button {...args} className={buttonClassName}>
        {args.children}
        <Button.Icon>★</Button.Icon>
      </Button>
    </div>
  ),
};

/**
 * Loader replacing the label — pairs Button.Loader with Button.Label so the
 * optional @dndd/react/styles/button.css (imported globally in
 * .storybook/preview.tsx) hides the label and centers the spinner while
 * loading.
 */
export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      <Button {...args} className={buttonClassName}>
        <Button.Loader className={spinnerClassName} />
        {args.children}
      </Button>
      <Button {...args} className={buttonClassName}>
        <Button.Loader className="relative">
          <span className={spinnerClassName} />
        </Button.Loader>
        <Button.Label>{args.children}</Button.Label>
      </Button>
    </div>
  ),
};
