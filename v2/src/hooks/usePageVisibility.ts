import { useEffect, useState } from "react";

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(
    () => document.visibilityState === "visible",
  );

  useEffect(() => {
    const sync = () => setIsVisible(document.visibilityState === "visible");
    const hide = () => setIsVisible(false);
    sync();
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pageshow", sync);
    window.addEventListener("pagehide", hide);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pageshow", sync);
      window.removeEventListener("pagehide", hide);
    };
  }, []);

  return isVisible;
}
