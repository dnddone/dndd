/**
 * The one sanctioned `any` escape hatch, used only at genuine type
 * boundaries. Everything else must avoid `any`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export type AnyFunction = (...args: Any[]) => Any;

export type AsyncFunction = (...args: Any[]) => Promise<Any>;

/**
 * Date ISO 8601 format
 */
export type DateIsoFormat = string;
