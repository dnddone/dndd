import { useEffect, useState, type RefObject } from "react";

/**
 * Keeps an element mounted while it's present and, once it stops being
 * present, until any running CSS animation/transition on it finishes — so
 * exit animations have time to play before the node is removed. Feed it the
 * ref of the animated node; drive that node's animation off its
 * `data-state="open"|"closed"` attribute.
 */
export const usePresence = (
  present: boolean,
  nodeRef: RefObject<HTMLElement | null>,
) => {
  const [mounted, setMounted] = useState(present);

  useEffect(() => {
    if (present) {
      setMounted(true);
      return;
    }

    const node = nodeRef.current;
    const animations = node?.getAnimations?.() ?? [];

    if (animations.length === 0) {
      setMounted(false);
      return;
    }

    let cancelled = false;

    Promise.allSettled(animations.map((animation) => animation.finished)).then(
      () => {
        if (!cancelled) {
          setMounted(false);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [present, nodeRef]);

  return mounted;
};
