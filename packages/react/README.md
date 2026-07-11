# @dndd/react

Headless, unstyled, accessibility-first React components. Behavior, state,
and a11y are baked in — no visual styling is applied. Bring your own
`className`/CSS.

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

## Philosophy

Modeled loosely on [`@restart/ui`](https://www.npmjs.com/package/@restart/ui):
correct roles, `aria-*` wiring, focus management, and keyboard interaction are
part of the component contract, not an afterthought. Nothing is styled for
you and nothing couples to a router, icon set, or CSS framework.
