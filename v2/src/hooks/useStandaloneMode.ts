import { useEffect, useState } from "react";

/**
 * Returns true when the app is running as an installed PWA
 * (standalone display mode on Android/desktop, or navigator.standalone on iOS).
 */
export function useStandaloneMode(): boolean {
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(display-mode: standalone)");

    const update = () => {
      // iOS Safari exposes `navigator.standalone`; other browsers use the
      // media query.
      const iosStandalone =
        (navigator as Navigator & { standalone?: boolean }).standalone === true;

      setStandalone(query.matches || iosStandalone);
    };

    update();

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return standalone;
}
