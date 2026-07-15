# dndd

Headless, unstyled, accessibility-first React building blocks — plus the
framework-agnostic utilities they lean on. A personal reuse kit, published under
the [`@dndd`](https://www.npmjs.com/org/dndd) npm scope so it stops getting
rebuilt in every project. Modeled loosely on
[`@restart/ui`](https://www.npmjs.com/package/@restart/ui): behavior and a11y
are baked in, styling is not.

[**Storybook catalog →**](https://dnddone.github.io/dndd/)

## Packages

| Package                         | What it is                                  |
| ------------------------------- | ------------------------------------------- |
| [`@dndd/react`](packages/react) | Headless React components (behavior + a11y) |
| [`@dndd/utils`](packages/utils) | Framework-agnostic helpers (type guards, …) |

## Why you'd want this

Building an accessible, keyboard-friendly component from scratch — correct
ARIA attributes, focus management, controlled/uncontrolled state — takes real
effort to get right, and it's easy to miss an edge case. `@dndd/react`
components ship that behavior baked in, but render no visual styling, so they
drop into any design system without a fight over CSS.

For example, `Button` handles the loading/disabled a11y contract for you —
`aria-busy`, `aria-disabled`, and blocking activation (including keyboard
Enter/Space) — while staying fully unstyled. Compose `Button.Icon`,
`Button.Loader`, and `Button.Label` for the visual loading state; each slot
is just a `<span>` marked with a `data-slot` attribute, so you decide how it
looks:

```tsx
import { Button } from "@dndd/react";

<Button loading={isSaving} onClick={handleSave}>
  <Button.Icon>
    <SaveIcon />
  </Button.Icon>
  Save
  <Button.Loader>
    <Spinner />
  </Button.Loader>
</Button>;
```

## Recommended companions

`@dndd/utils` stays intentionally small. For general data manipulation reach for
[Remeda](https://remedajs.com) rather than expecting it here.
