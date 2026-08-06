import { useCallback, useRef } from "react";
import {
  ScrollView,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

type Options = {
  /** Space above the anchor after scroll (px). */
  topOffset?: number;
  /** Wait for result layout after setState. */
  delayMs?: number;
};

/**
 * Scroll a ScreenShell / ToolScreen to a result anchor after calculate.
 * Tracks contentOffset so measureInWindow can map to scrollY.
 */
export function useScrollToAnchor(options: Options = {}) {
  const topOffset = options.topOffset ?? 12;
  const delayMs = options.delayMs ?? 80;
  const scrollRef = useRef<ScrollView>(null);
  const anchorRef = useRef<View>(null);
  const scrollYRef = useRef(0);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollYRef.current = e.nativeEvent.contentOffset.y;
    },
    []
  );

  const scrollToAnchor = useCallback(() => {
    const run = () => {
      const scroll = scrollRef.current;
      const anchor = anchorRef.current;
      if (!scroll || !anchor) {
        scroll?.scrollToEnd({ animated: true });
        return;
      }

      // ScrollView is a View at runtime; types omit measureInWindow.
      const scrollView = scroll as unknown as View;
      anchor.measureInWindow((_ax: number, ay: number) => {
        scrollView.measureInWindow((_sx: number, sy: number) => {
          const targetY = Math.max(
            0,
            scrollYRef.current + (ay - sy) - topOffset
          );
          scroll.scrollTo({ y: targetY, animated: true });
        });
      });
    };

    // Double rAF: wait for React commit + native layout of new result.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(run, delayMs);
      });
    });
  }, [delayMs, topOffset]);

  return { scrollRef, anchorRef, onScroll, scrollToAnchor };
}

export type ScrollToAnchorApi = ReturnType<typeof useScrollToAnchor>;
