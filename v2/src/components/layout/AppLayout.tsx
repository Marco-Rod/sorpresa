import { Outlet, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

import { DeveloperPanel } from "../debug/DeveloperPanel";
import { MusicControl } from "../audio/MusicControl";
import { PerformanceDebug } from "../debug/PerformanceDebug";
import { PwaUpdatePrompt } from "../pwa/PwaUpdatePrompt";
import { useAudioUnlock } from "../../hooks/useAudioUnlock";
import { useBirthdayCelebration } from "../../hooks/useBirthdayCelebration";
import { useCelebrationPreload } from "../../hooks/useCelebrationPreload";

export function AppLayout() {
  const { pathname } = useLocation();
  // Reset before paint: the long memory must not leave the home page scrolled.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  const memory = pathname === '/memories/2026';
  if (memory) return <main className="memory-layout"><Outlet /><PwaUpdatePrompt /></main>;
  return <LiveLayout />;
}

function LiveLayout() {
  const isHome = useLocation().pathname === '/';
  useAudioUnlock();
  useBirthdayCelebration();
  useCelebrationPreload();

  return (
    <main>
      <Outlet />

      {!isHome && <MusicControl />}

      <PwaUpdatePrompt />

      {import.meta.env.DEV && (
        <>
          <PerformanceDebug />
          <DeveloperPanel />
        </>
      )}
    </main>
  );
}
