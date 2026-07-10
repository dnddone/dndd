# dndd

Headless, unstyled, accessibility-first React building blocks — plus the
framework-agnostic utilities they lean on. A personal reuse kit, published under
the [`@dndd`](https://www.npmjs.com/org/dndd) npm scope so it stops getting
rebuilt in every project. Modeled loosely on
[`@restart/ui`](https://www.npmjs.com/package/@restart/ui): behavior and a11y
are baked in, styling is not.

## Packages

| Package                                                 | What it is                                  | Published |
| ------------------------------------------------------- | ------------------------------------------- | --------- |
| [`@dndd/react`](packages/react)                         | Headless React components (behavior + a11y) | ✅        |
| [`@dndd/utils`](packages/utils)                         | Framework-agnostic helpers (type guards, …) | ✅        |
| [`@dndd/types`](packages/types)                         | Shared TypeScript types                     | ✅        |
| [`@dndd/eslint-config`](packages/eslint-config)         | Internal ESLint config                      | —         |
| [`@dndd/typescript-config`](packages/typescript-config) | Internal tsconfig presets                   | —         |

## Stack

pnpm workspaces · Turborepo · tsup (ESM + CJS + `.d.ts`) · Changesets.

## Commands

```bash
pnpm install     # install all workspaces
pnpm dev         # rebuild packages on change (tsup --watch)
pnpm build       # build publishable packages
pnpm lint        # lint all
pnpm typecheck   # type-check all
pnpm test        # run tests
pnpm format      # prettier --write
```

## Releasing

```bash
pnpm changeset          # describe the change + pick a bump
pnpm version-packages   # apply versions + changelogs
pnpm release            # build packages + changeset publish
```

## Recommended companions

`@dndd/utils` stays intentionally small. For general data manipulation reach for
[Remeda](https://remedajs.com) rather than expecting it here.
