# dndd — Claude Instructions

A small collection of **headless, unstyled, accessibility-first** building
blocks that I kept rebuilding in every project — published once so I stop.
Modeled loosely on [`@restart/ui`](https://www.npmjs.com/package/@restart/ui):
behavior and a11y are baked in, styling is not.

Published to npm under the **`@dndd`** scope (owned since 2022). Not a product,
not competing with Radix / React Aria — a personal reuse kit that experienced
developers would still rate as clean.

## Packages

pnpm + Turborepo monorepo.

```
apps/
  playground/        # Vite + React app for manually exercising @dndd/react in a browser — not published
packages/
  react/             # @dndd/react — headless React components (behavior + a11y, no styles) — published
  utils/             # @dndd/utils — framework-agnostic helpers (type guards, ...) — published
  types/             # @dndd/types — shared TypeScript types — internal, not published
  eslint-config/     # @dndd/eslint-config — internal, not published
  typescript-config/ # @dndd/typescript-config — internal, not published
```

- Only `@dndd/react` and `@dndd/utils` are **published** so far.
- `@dndd/types` is `private` — it exports straight from `src/index.ts` (no
  build step, no `dist`) and is meant for internal workspace use only, the
  same pattern as `eslint-config`/`typescript-config`. It's still the single
  source of truth for any type shared between `react` and `utils` — never
  duplicate a shared type by hand — it's just not on npm. Since it holds only
  compile-time types, a consuming package's own tsup build inlines them into
  its `.d.ts` output at publish time, so this doesn't block anything.
- `apps/playground` is a minimal Vite app for manually exercising components
  in a real browser (unit tests cover behavior; the playground is for eyeballing
  and clicking around). It depends on `@dndd/react` via `workspace:*`, so its
  `dev`/`build`/`typecheck` tasks need `@dndd/react`'s `dist` to exist first —
  `turbo`'s `^build` dependency on the `dev` task handles that. Add a section
  to `apps/playground/src/App.tsx` for each new component as it's built; keep
  it a flat manual scratchpad, not a Storybook-style catalog.
- **Deep-import from third-party libraries; avoid barrel files on hot paths.**

## Design principles

- **Headless first.** Components ship behavior, state, and a11y — no baked-in
  visual styling. Consumers bring their own styles via `className`/props.
- **Compound components via Context**, never `Children.map` + `cloneElement`
  introspection. A parent exposes state through context; subcomponents read it
  with a `useX()` hook that throws when used outside its provider.
- **Controlled and uncontrolled** both supported via a `useControllableState`
  hook — never force a consumer into one mode.
- **A11y is not optional.** Correct roles, `aria-*` wiring (conditionally set
  when the id exists), focus management, and keyboard interaction are part of
  the component contract, not a nice-to-have.
- **No hard third-party coupling.** Router, icon set, etc. are injected by the
  consumer (props/context) rather than imported directly, so a component never
  drags a peer like `react-router-dom` into someone else's bundle.

## Commits

Follow conventional commits. Subject line: 50 chars max, compact. Use a
multiline body only when extra context is needed.

```
feat: add headless Modal
fix: block Button activation while loading
```

### GitHub mentions

GitHub auto-links a bare `@dndd` in commit messages, PR titles/descriptions,
and issue/PR comments to the existing GitHub user `dndd` (not this project).
Always wrap it in backticks — `` `@dndd` `` — or other code formatting in any
GitHub-rendered text. Code, package names, and prose in docs (like this file)
are unaffected since GitHub doesn't parse those as mentions.

## Commands

Always use pnpm scripts and turbo. Never run raw binaries (`tsc`, `eslint`,
`tsup`, `vitest`).

```bash
pnpm install        # install all workspaces
pnpm dev            # rebuild packages on change (tsup --watch, turbo)
pnpm build          # build all publishable packages (tsup)
pnpm lint           # lint all
pnpm typecheck      # type-check all
pnpm test           # run tests (turbo)
pnpm format         # prettier --write the repo
```

Per-workspace: `pnpm --filter @dndd/react <script>`.

## Post-task checklist

After finishing edits, format and type-check the affected workspace:

```bash
pnpm format
pnpm --filter <workspace> typecheck
```

Defer the full lint + typecheck + test suite to right before a commit or ship —
not after every edit.

## Publishing

- Build with **tsup** — dual ESM + CJS + `.d.ts`. Each publishable package sets
  a proper `exports` map (dist + types), `sideEffects: false`, and
  `publishConfig.access: "public"`.
- **React is a `peerDependency`** of `@dndd/react` (never a `dependency`) so
  consumers don't get a duplicate React.
- Releasing is driven by **GitHub Releases**, not Changesets — see
  `.github/workflows/release.yml`. `@dndd/react` and `@dndd/utils` version
  independently; a release tag targets exactly one of them and only that
  package is bumped, built, and published:

  ```
  react@0.3.0   → bumps + publishes @dndd/react only
  utils@0.2.0   → bumps + publishes @dndd/utils only
  ```

  Create the release from the GitHub UI with that tag — the workflow reads
  the tag, bumps the package's `version` in `package.json`, builds, publishes
  to npm, and commits the version bump back to `main`. Never hand-bump a
  version or `npm publish` locally.

- **Changelog**: use the GitHub Release notes as the changelog. When drafting
  a release, "Generate release notes" defaults to diffing against the last
  tag overall — since tags interleave between packages, set the **"Previous
  tag"** dropdown to that same package's last tag (e.g. `react@0.2.0` when
  drafting `react@0.3.0`) so the notes don't pull in the other package's PRs.

- `@dndd/types` is `private` and deliberately excluded from the release
  workflow — it's internal-only, not a published package.

## Linting

- **ESLint flat config** (ESLint 9). Each workspace has an `eslint.config.mjs`
  that re-exports a shared config from `@dndd/eslint-config` (`/base` or
  `/react`). Plugins are `dependencies` of `@dndd/eslint-config` and imported
  as modules — so there is **no `.npmrc` plugin-hoisting hack**, unlike legacy
  eslintrc under pnpm.
- Stack is lean and flat-native: `@eslint/js` + `typescript-eslint` +
  `eslint-plugin-react` + `eslint-plugin-react-hooks` + `eslint-config-prettier`.
  No `@vercel/style-guide`.
- Rules are non-type-checked `recommended`. If you want type-aware rules later,
  add `parserOptions.projectService: true` in the shared config.
- `no-explicit-any` is enforced with no sanctioned escape hatch — use
  `unknown` (see `Unknown` in `@dndd/types`) and narrow it instead.

## TypeScript

- Strict mode on (`noUnusedLocals`, `noUnusedParameters`,
  `noUncheckedIndexedAccess`). No `any` — use `unknown` and narrow it.
- Prefer `type` over `interface`. Prefer arrow functions.
- Component props type is always named `Props`, declared directly above the
  component it belongs to. Type components with `React.FC<Props>`.
- `Props` stays locally named inside its own file (avoids collisions per
  component), but is `export`ed so a component's folder `index.ts` can
  re-export it under a unique public name for consumers to reuse:
  `export type { Props as ButtonIconProps } from "./ButtonIcon";`.
- Props extend the underlying element's own props type
  (`ButtonHTMLAttributes<HTMLButtonElement>`, `ComponentPropsWithoutRef<...>`),
  never a bare object when a DOM element is being rendered.
- Descriptive names; single-letter only for `for` loop indices. Descriptive
  callback params too — `(item) =>`, never `(a) =>`.
- Always use block syntax for conditionals — no inline single-line `if`.
- Always use multiline `/** */` block comments, even for a single line of
  text. Never use `//` or single-line `/** ... */`, except `eslint-disable` /
  `@ts-*` directives:

  ```ts
  // Incorrect
  /** Values are i18n keys */

  // Correct
  /**
   * Values are i18n keys
   */
  ```

- Use the type-guard utils from `@dndd/utils` for value checks
  (`isString`, `isNumber`, `isObject`, `isArray`, `isNullable`, `isBoolean`)
  rather than raw `typeof`.

## Naming

- camelCase for variables, functions, properties.
- MACRO_CASE for fixed module-level constants (config, keys, formats, lookups).
- Runtime-computed values stay camelCase even when `const`.

## Destructuring

Prefer destructuring. Choose the pattern based on whether you need the full
object:

```ts
// Only need fields — destructure in params
const handleSubmit = ({ foo, bar }: Data) => {
  fn({ id: foo });
};

// Need derived values + full object — keep param, destructure in body
const renderItem = (item: Item) => {
  const { id, time } = item;
  const formattedTime = dayjs(time).format("l");
  return { key: id, formattedTime, onClick: () => handleClick(item) };
};

// Need full object + multiple fields — keep param, destructure in body
const handleSubmit = (data: Data) => {
  const { foo, bar, ...rest } = data;
  fn(rest);
  onSubmit(data);
};
```

When destructuring in a nested scope would shadow an outer variable, resolve the
naming conflict explicitly — never silently shadow (alias the inner binding, or
give the outer param a more specific name).

## Component conventions (`@dndd/react`)

- One component per file; `index.ts` is for re-exports only — never define a
  component in it.
- Compound components use the Context pattern. Each subcomponent gets its own
  file; the folder is named after the root component and `index.ts` re-exports
  the assembled `Object.assign(Root, { Sub, ... })`.
- Avoid folder nesting when a folder would hold a single component file plus an
  `index.ts` — flatten to a sibling `.tsx` file instead.
- **Avoid boolean props that toggle behavior** (`isEditing`, `showFooter`) —
  each doubles the states a component must handle. Prefer composition or an
  explicit variant component.
- `forwardRef` any component whose ref a consumer would reasonably want.
- **Performance**: `memo()` expensive children so a parent can early-return
  before they compute; depend on primitives (`user.id`) not objects in effect
  deps; derive state during render instead of syncing with `useEffect` +
  `useState`; `Promise.all()` independent async work.

## Styling (headless + optional presets)

The core components are **unstyled** — they render semantic elements, forward
`className`, and spread the rest of the element props. Consumers style them
however they like.

If a styled preset layer is added later, it lives behind a separate subpath
export (e.g. `@dndd/react/styled`) so pulling in styles is always opt-in and
never forced on a headless consumer. Presets use `tailwind-variants` (`tv()`)
for variants — not boolean props, not CVA.

## Testing

- Vitest. Tests colocated in `__tests__/` next to source.
- Filename: `<module>.test.ts(x)`.
- Keep tests simple — avoid unnecessary abstraction.

## Documentation and Planning

Non-trivial design work is written down before it's built. Project docs live in
`docs/`:

| If you need…                   | Load                                  |
| ------------------------------ | ------------------------------------- |
| Design docs                    | `docs/design-docs/`                   |
| Execution plans                | `docs/exec-plans/{active,completed}/` |
| Architectural Decision Records | `docs/decisions/`                     |

- **Design doc**: `docs/design-docs/YYYY-MM-DD-short-description.md`, with
  `**Date:**` and `**Status:**` (`Draft` | `Approved`) at the top.
- **Execution plan**: only after a design doc is **Approved**. A sequence of
  phases, each a self-contained, independently mergeable change with its own
  `**Status:**` marker. Move the file to `completed/` when all phases are done.

Create `docs/` tiers lazily — only when the first document of that kind is
actually written.

## Important process rules

- **If you discover a new rule during development, add it to this file before
  finishing** (or the right `docs/` file if it's a design/planning artifact).
  Don't let project-wide knowledge live only in conversation history.
- **After every correction from the user, ask: is this specific to this line,
  or a general pattern?** If general, extract it into this file immediately.
- **Record architectural insights and verified facts** — when you investigate a
  dependency's behavior, write it down in `docs/` instead of relying on memory.

## Git Operations

Never commit, push, or open a PR unless explicitly asked in that same turn. An
earlier approval does not carry forward — each commit/push needs its own ask.
