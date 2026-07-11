import { createContext, useContext } from "react";
import { invariant } from "@dndd/utils";

type ButtonContextValue = {
  loading: boolean;
};

export const ButtonContext = createContext<ButtonContextValue | null>(null);

export const useButtonContext = () => {
  const context = useContext(ButtonContext);

  invariant(context, "Button.Loader must be used within a Button");

  return context;
};
