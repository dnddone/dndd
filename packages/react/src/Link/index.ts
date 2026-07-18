import { Link as LinkRoot } from "./Link";
import { Icon } from "../Icon";

export const Link = Object.assign(LinkRoot, {
  Icon,
});

export type { Props as LinkProps } from "./Link";
export type { Props as LinkIconProps } from "../Icon";
