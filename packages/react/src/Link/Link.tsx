import {
  forwardRef,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ForwardRefRenderFunction,
  type ReactElement,
} from "react";
import { isString } from "@dndd/utils";

type AsProp<C extends ElementType> = {
  /**
   * Component or element to render as — e.g. react-router-dom's `Link` or
   * Next.js's `Link`. Defaults to a native anchor. Ignored when the
   * destination resolves to an external URL or `external` is set, since a
   * router component can't navigate to it anyway.
   */
  as?: C;
};

type ExternalProp = {
  /**
   * Forces the external-link treatment (native `<a>`, `target="_blank"`,
   * `rel="noopener noreferrer"`, `data-external`) even when the destination
   * doesn't look external — e.g. an internal page that should deliberately
   * open in a new tab. Absolute URLs and `mailto:`/`tel:` links get this
   * treatment automatically; this prop is only needed to opt in for
   * everything else.
   */
  external?: boolean;
};

export type Props<C extends ElementType = "a"> = AsProp<C> &
  ExternalProp &
  Omit<ComponentPropsWithoutRef<C>, "as">;

type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];

type PolymorphicLinkComponent = <C extends ElementType = "a">(
  props: Props<C> & { ref?: PolymorphicRef<C> },
) => ReactElement | null;

const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+.-]*:)?\/\//i;
const NON_HTTP_SCHEME_PATTERN = /^(?:mailto|tel):/i;

const isExternalDestination = (destination: unknown): destination is string =>
  isString(destination) &&
  (ABSOLUTE_URL_PATTERN.test(destination) ||
    NON_HTTP_SCHEME_PATTERN.test(destination));

function renderLink<C extends ElementType = "a">(
  { as, external = false, ...props }: Props<C>,
  ref?: PolymorphicRef<C>,
) {
  /**
   * Read generically: react-router-dom's Link takes `to`, native anchors
   * and Next.js's Link take `href`. Reading both means this package never
   * imports either router to know which one is in play.
   */
  const runtimeProps = props as unknown as Record<string, unknown>;
  const destination = isString(runtimeProps.href)
    ? runtimeProps.href
    : isString(runtimeProps.to)
      ? runtimeProps.to
      : undefined;

  if (external || isExternalDestination(destination)) {
    const anchorProps: Record<string, unknown> = { ...runtimeProps };
    delete anchorProps.to;

    return (
      <a
        ref={ref as ComponentPropsWithRef<"a">["ref"]}
        target="_blank"
        rel="noopener noreferrer"
        {...(anchorProps as ComponentPropsWithoutRef<"a">)}
        href={destination}
        data-external
      />
    );
  }

  const Component = as ?? "a";

  return (
    <Component
      ref={ref}
      {...(props as unknown as ComponentPropsWithoutRef<ElementType>)}
    />
  );
}

const LinkComponent = forwardRef(
  renderLink as unknown as ForwardRefRenderFunction<
    HTMLElement,
    Props<ElementType>
  >,
);

LinkComponent.displayName = "Link";

/**
 * Headless link. Renders a native <a> by default, or whatever component is
 * passed via `as` (react-router-dom's Link, Next.js's Link, ...) so this
 * package never depends on a router directly. When the destination is an
 * absolute URL or a `mailto:`/`tel:` link — or `external` is explicitly
 * set, e.g. for an internal page that should open in a new tab — `as` is
 * ignored, a native <a> is rendered with `target="_blank"` and
 * `rel="noopener noreferrer"`, and `data-external` is set so consumers can
 * style their own affordance.
 */
export const Link = LinkComponent as unknown as PolymorphicLinkComponent;
