import { createContext, useContext, type ReactNode } from "react";

import type { ScrollToAnchorApi } from "@/src/hooks/useScrollToAnchor";

const ScrollToResultContext = createContext<ScrollToAnchorApi | null>(null);

/** Parent screen owns ScrollView refs; nested calculators call scrollToAnchor. */
export function ScrollToResultProvider({
  value,
  children,
}: {
  value: ScrollToAnchorApi;
  children: ReactNode;
}) {
  return (
    <ScrollToResultContext.Provider value={value}>
      {children}
    </ScrollToResultContext.Provider>
  );
}

/** Safe for components that may render outside a provider. */
export function useOptionalScrollToResult(): ScrollToAnchorApi | null {
  return useContext(ScrollToResultContext);
}
