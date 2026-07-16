# @dndd/utils

[![npm version](https://img.shields.io/npm/v/@dndd/utils.svg)](https://www.npmjs.com/package/@dndd/utils)
[![CI](https://img.shields.io/github/actions/workflow/status/dnddone/dndd/ci.yml?branch=main)](https://github.com/dnddone/dndd/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@dndd/utils.svg)](https://www.npmjs.com/package/@dndd/utils)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@dndd/utils)](https://bundlephobia.com/package/@dndd/utils)

Framework-agnostic helper functions with no runtime dependencies.

## Install

```bash
npm install @dndd/utils
```

## Type guards

```ts
import {
  isString,
  isNumber,
  isObject,
  isArray,
  isNullable,
  isBoolean,
  isFunction,
} from "@dndd/utils";

isString("hi"); // true
isNumber("42"); // true — numeric strings count
isObject([1, 2]); // false — arrays are excluded
isArray<number>(value); // value is number[]
isNullable(value); // value is null | undefined
isBoolean(true); // true
isFunction(() => {}); // true — also true for classes
```

Prefer these over raw `typeof`/`instanceof` checks — they narrow correctly
and cover the edge cases (`isNumber` accepts finite numeric strings,
`isObject` excludes arrays, `isString` covers boxed `String` instances).

## invariant

```ts
import { invariant } from "@dndd/utils";

invariant(user, "user must be defined here");
user.name; // TypeScript now knows `user` is non-null

invariant(count > 0); // throws "Invariant failed" if the condition is falsy
```

Throws if the value is `false`, `null`, or `undefined`; narrows it afterward,
so it also works as a type guard for assumptions the type system can't verify
on its own.

## ensureArray

```ts
import { ensureArray } from "@dndd/utils";

ensureArray("a"); // ["a"]
ensureArray(["a", "b"]); // ["a", "b"] — unchanged
```

Normalizes a value that may or may not already be an array — handy for props
that accept `T | T[]`.

## Scope

Stays intentionally small — a place for the handful of type guards and
primitives that get rebuilt in every project. For general-purpose data
manipulation (grouping, sorting, deep operations, ...), reach for
[Remeda](https://remedajs.com) instead of expecting it here.
