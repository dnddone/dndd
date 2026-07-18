import {
  forwardRef,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ForwardRefRenderFunction,
  type MouseEvent,
  type ReactElement,
} from "react";
import { Button } from "../Button/Button";
import { useModalContext } from "./ModalContext";

type AsProp<C extends ElementType> = {
  /**
   * Element or component to render as. Defaults to `@dndd/react`'s `Button`
   * (a native `<button>`); pass any tag or component to render the trigger
   * as something else — an anchor, a menu item, your own control.
   */
  as?: C;
};

export type Props<C extends ElementType = typeof Button> = AsProp<C> &
  Omit<ComponentPropsWithoutRef<C>, "as">;

type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];

type PolymorphicTriggerComponent = <C extends ElementType = typeof Button>(
  props: Props<C> & { ref?: PolymorphicRef<C> },
) => ReactElement | null;

/**
 * Opens the enclosing Modal. Renders `@dndd/react`'s `Button` by default,
 * or whatever is passed via `as`, and wires
 * `aria-haspopup`/`aria-expanded`/`aria-controls` pointing at
 * `Modal.Content`. A consumer `onClick` runs first and can `preventDefault`
 * to stop the open. No visual styling is applied.
 */
function TriggerComponent<C extends ElementType = typeof Button>(
  { as, ...props }: Props<C>,
  ref?: PolymorphicRef<C>,
) {
  const { open, setOpen, contentId } = useModalContext();
  const Component = (as ?? Button) as ElementType;
  const runtimeProps = props as Record<string, unknown>;
  const consumerOnClick = runtimeProps.onClick as
    ((event: MouseEvent) => void) | undefined;

  return (
    <Component
      ref={ref}
      {...(runtimeProps as ComponentPropsWithoutRef<ElementType>)}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={(event: MouseEvent) => {
        consumerOnClick?.(event);

        if (!event.defaultPrevented) {
          setOpen(true);
        }
      }}
    />
  );
}

const ForwardedTrigger = forwardRef(
  TriggerComponent as ForwardRefRenderFunction<HTMLElement, Props<ElementType>>,
);

ForwardedTrigger.displayName = "Modal.Trigger";

export const ModalTrigger =
  ForwardedTrigger as unknown as PolymorphicTriggerComponent;
