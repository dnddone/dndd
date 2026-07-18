/**
 * True when running in a browser environment with a real `document` — used
 * to guard portal targets and DOM access so components stay SSR-safe. Kept
 * local to `@dndd/react` rather than `@dndd/utils`: it's a DOM/environment
 * concern, not a framework-agnostic value guard.
 */
export const isBrowser = () => typeof document !== "undefined";
