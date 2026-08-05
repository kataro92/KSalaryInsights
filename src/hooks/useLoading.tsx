import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { motion } from "@/src/theme/tokens";

type LoadingContextValue = {
  visible: boolean;
  message?: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  runWithLoading: <T>(task: () => Promise<T>, message?: string) => Promise<T>;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);

  const clearDelay = useCallback(() => {
    if (delayTimer.current) {
      clearTimeout(delayTimer.current);
      delayTimer.current = null;
    }
  }, []);

  const showLoading = useCallback(
    (nextMessage?: string) => {
      const gen = ++generation.current;
      setMessage(nextMessage);
      clearDelay();
      delayTimer.current = setTimeout(() => {
        if (generation.current === gen) {
          setVisible(true);
        }
      }, motion.loadingDelayMs);
    },
    [clearDelay]
  );

  const hideLoading = useCallback(() => {
    generation.current += 1;
    clearDelay();
    setVisible(false);
    setMessage(undefined);
  }, [clearDelay]);

  const runWithLoading = useCallback(
    async <T,>(task: () => Promise<T>, nextMessage?: string): Promise<T> => {
      showLoading(nextMessage);
      try {
        return await task();
      } finally {
        hideLoading();
      }
    },
    [hideLoading, showLoading]
  );

  const value = useMemo(
    () => ({ visible, message, showLoading, hideLoading, runWithLoading }),
    [visible, message, showLoading, hideLoading, runWithLoading]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextValue {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return ctx;
}
