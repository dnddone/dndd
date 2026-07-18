# @dndd/react

[![npm version](https://img.shields.io/npm/v/@dndd/react.svg)](https://www.npmjs.com/package/@dndd/react)
[![CI](https://img.shields.io/github/actions/workflow/status/dnddone/dndd/ci.yml?branch=main)](https://github.com/dnddone/dndd/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@dndd/react.svg)](https://www.npmjs.com/package/@dndd/react)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@dndd/react)](https://bundlephobia.com/package/@dndd/react)

Headless, unstyled, accessibility-first React components. Behavior, state,
and a11y are baked in — no visual styling is applied. Bring your own
`className`/CSS. Some components pair with an optional, structural-only
stylesheet (positioning mechanics, never color/font/spacing) — see
[Optional structural styles](#optional-structural-styles) below.

## Install

```bash
npm install @dndd/react
```

`react` and `react-dom` (`^18 || ^19`) are peer dependencies.

## Button

```tsx
import { Button } from "@dndd/react";

<Button loading={isSubmitting} onClick={handleSubmit}>
  Save
</Button>;
```

Renders a native `<button>` and forwards every standard button attribute.

- `loading` — when `true`, blocks activation (including keyboard Enter/Space)
  without removing the button from the tab order, and sets `aria-busy` +
  `data-loading` for you to hook a spinner off. Headless: no spinner is
  rendered for you.
- `disabled` — standard native behavior, also reflected as `aria-disabled`.

### Compound slots: `Button.Icon`, `Button.Loader`, `Button.Label`

```tsx
<Button loading={loading} onClick={handleSubmit}>
  <Button.Icon>
    <SaveIcon />
  </Button.Icon>
  Save
</Button>;

<Button loading={loading} onClick={handleSubmit}>
  <Button.Loader>
    <Spinner />
  </Button.Loader>
  <Button.Label>Save</Button.Label>
</Button>;
```

Each slot renders a plain `<span data-slot="...">` — no layout or spacing is
applied, so positioning is entirely up to your own CSS/JSX.

- **`Button.Icon`** — decorative icon slot. Position it via JSX order (before
  `children` for a leading icon, after for a trailing one). `aria-hidden` by
  default; pass your own to override.
- **`Button.Loader`** — renders nothing unless the parent `Button`'s `loading`
  prop is `true` (reads it from context — must be used inside a `Button`).
  Placed before your text it's a leading spinner alongside visible content;
  paired with `Button.Label` it fully replaces the text while loading.
- **`Button.Label`** — optional wrapper for the button's text, marked with
  `data-slot="label"` so your own CSS can hide it while loading, e.g.:

  ```css
  button[data-loading] [data-slot="label"] {
    visibility: hidden;
  }
  ```

  Only needed if you want the loader to fully replace the text instead of
  sitting alongside it — plain text children work fine otherwise.

### Optional structural styles

The rule above — and the absolute-positioning needed to center a loader over
a hidden label — ship as an optional stylesheet so you don't have to write
them yourself:

```ts
import "@dndd/react/styles/button.css";
```

It's structural only: no color, font, or spacing opinions, and no spinner
appearance — bring your own spinner. Every rule is wrapped in `:where()` so
its specificity is zero; any selector of your own targeting the same
elements wins automatically, no `!important` needed.

**Overriding with Tailwind:** Tailwind v3 utility classes override the
stylesheet automatically — a class selector always beats `:where()`. Tailwind
v4 puts its utilities in a native CSS `@layer`, and unlayered styles (like
ours) always win over layered ones regardless of specificity, so a plain
utility class needs the `!` important modifier to override us:

```tsx
<Button.Label className="visible!">Save</Button.Label>
```

To avoid needing `!` on every override, assign our stylesheet to one of
Tailwind's own layers by importing it as CSS rather than JS, ahead of your
`utilities` layer:

```css
@import "tailwindcss";
@import "@dndd/react/styles/button.css" layer(base);
```

### Prop types

`ButtonProps`, `ButtonIconProps`, `ButtonLoaderProps`, and `ButtonLabelProps`
are exported for building your own wrappers:

```tsx
import type { ButtonProps } from "@dndd/react";

type SubmitButtonProps = ButtonProps & { formId: string };
```

## Link

```tsx
import { Link } from "@dndd/react";

<Link href="/about">About</Link>;
```

Renders a native `<a>` by default and forwards every standard anchor
attribute.

### Polymorphic `as`

Pass any component via `as` to render through it instead — react-router-dom's
`Link`, Next.js's `Link`, or your own — without `@dndd/react` ever importing a
router itself:

```tsx
import { Link as RouterLink } from "react-router-dom";

<Link as={RouterLink} to="/dashboard">
  Dashboard
</Link>;
```

Props are generically merged from whatever `as` expects (TypeScript infers the
right shape), so this works whether the underlying component wants `to`
(react-router-dom) or `href` (Next.js, native `<a>`) — `Link` doesn't try to
reconcile the two, it just reads whichever is present.

### External destinations

When the destination (`href` or `to`) resolves to an absolute URL, a
protocol-relative URL, or a `mailto:`/`tel:` link, `as` is ignored — a router
component can't navigate to it anyway — and a native `<a>` is rendered with
`target="_blank"` and `rel="noopener noreferrer"`:

```tsx
<Link href="https://example.com">Example</Link>
// → <a href="https://example.com" target="_blank" rel="noopener noreferrer" data-external="true">
```

`data-external` is set so you can style your own affordance (icon, visible
"opens in new tab" text, etc.) — nothing is injected for you, since that's a
content/i18n decision this headless library doesn't own:

```css
a[data-external="true"]::after {
  content: "↗";
}
```

You can still override `target`/`rel` yourself; your own props win over the
defaults.

### Compound slot: `Link.Icon`

```tsx
<Link href="/about">
  <Link.Icon>
    <ExternalIcon />
  </Link.Icon>
  About
</Link>
```

Same `Icon` slot as `Button.Icon` — a plain `<span data-slot="icon">`
positioned via JSX order, `aria-hidden` by default (pass your own to
override).

### Prop types

`LinkProps` and `LinkIconProps` are exported for building your own wrappers:

```tsx
import type { LinkProps } from "@dndd/react";

type NavLinkProps = LinkProps & { active?: boolean };
```

## Modal

```tsx
import { Modal } from "@dndd/react";

<Modal>
  <Modal.Trigger>Open</Modal.Trigger>
  <Modal.Overlay />
  <Modal.Content aria-label="Example modal">
    Content
    <Modal.Close>Close</Modal.Close>
  </Modal.Content>
</Modal>;
```

`Modal.Overlay` and `Modal.Content` each portal to `document.body` (or a
`container` you pass), so the modal is free of any parent stacking context,
`overflow`, or `transform`. `Modal.Content` is a `role="dialog"` `aria-modal`
panel that traps focus, moves focus inside on open, restores it to the
trigger on close, and closes on Esc. Both slots carry `data-state="open"` /
`"closed"` and stay mounted through a CSS exit animation/transition before
unmounting. No visual styling is applied — style the panel and its backdrop
however you like.

- **Controlled or uncontrolled** — omit `open` to let `Modal` manage its own
  state (seeded by `defaultOpen`), or pass `open`/`onOpenChange` to drive it
  yourself, e.g. from a route.
- **`Modal.Trigger`** — renders `@dndd/react`'s `Button` by default (or
  whatever's passed via `as`) and opens the modal. Wired with
  `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` pointing at
  `Modal.Content`'s `id` (auto-generated unless you pass your own).
- **`Modal.Overlay`** — the backdrop behind `Modal.Content`. Optional:
  clicking it requests close, subject to `onOverlayClick`. Omit it if you
  don't want outside-click dismissal or a backdrop element at all.
- **`Modal.Close`** — renders `@dndd/react`'s `Button` and closes the modal.
  No default content (e.g. an "×" icon) is rendered — bring your own.

### Prop types

`ModalProps`, `ModalTriggerProps`, `ModalOverlayProps`, `ModalContentProps`,
and `ModalCloseProps` are exported for building your own wrappers.

## Philosophy

Modeled loosely on [`@restart/ui`](https://www.npmjs.com/package/@restart/ui):
correct roles, `aria-*` wiring, focus management, and keyboard interaction are
part of the component contract, not an afterthought. Nothing is styled for
you and nothing couples to a router, icon set, or CSS framework.
