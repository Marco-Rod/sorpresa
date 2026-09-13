import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref to attach to a DOM element and a boolean `near`
 * that becomes true when the element enters (or is about to enter)
 * the viewport, based on IntersectionObserver with the given rootMargin.
 *
 * Used to lazy-mount Canvas effects only when the user is scrolling
 * close to them, avoiding multiple simultaneous animation loops.
 */
export function useNearViewport(rootMargin = "250px") {
  const ref = useRef<HTMLElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      entries => {
        setNear(entries[0].isIntersecting);
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, near };
}
