import { Button as ButtonRoot } from "./Button";
import { ButtonIcon } from "./ButtonIcon";
import { ButtonLabel } from "./ButtonLabel";
import { ButtonLoader } from "./ButtonLoader";

export const Button = Object.assign(ButtonRoot, {
  Icon: ButtonIcon,
  Label: ButtonLabel,
  Loader: ButtonLoader,
});

export type { Props as ButtonProps } from "./Button";
export type { Props as ButtonIconProps } from "./ButtonIcon";
export type { Props as ButtonLabelProps } from "./ButtonLabel";
export type { Props as ButtonLoaderProps } from "./ButtonLoader";
