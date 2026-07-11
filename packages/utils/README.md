# @dndd/utils

Framework-agnostic helper functions with no runtime dependencies.

## Install

```bash
npm install @dndd/utils
```

## Type guards

```ts
import { isString, isNumber, isObject, isArray, isNullable, isBoolean } from "@dndd/utils";

isString("hi"); // true
isNumber("42"); // true — numeric strings count
isObject([1, 2]); // false — arrays are excluded
isArray<number>(value); // value is number[]
isNullable(value); // value is null | undefined
isBoolean(true); // true
```

Prefer these over raw `typeof`/`instanceof` checks — they narrow correctly
and cover the edge cases (`isNumber` accepts finite numeric strings,
`isObject` excludes arrays, `isString` covers boxed `String` instances).

## Scope

Stays intentionally small — a place for the handful of type guards and
primitives that get rebuilt in every project. For general-purpose data
manipulation (grouping, sorting, deep operations, ...), reach for
[Remeda](https://remedajs.com) instead of expecting it here.
