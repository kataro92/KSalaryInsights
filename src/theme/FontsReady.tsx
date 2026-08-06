import { createContext, useContext } from "react";

/** True after Plus Jakarta Sans faces are loaded via `useFonts`. */
export const FontsReadyContext = createContext(false);

export function useFontsReady(): boolean {
  return useContext(FontsReadyContext);
}
