import { Outlet, useLocation } from "react-router-dom";

import { DeveloperPanel } from "../debug/DeveloperPanel";
import { MusicControl } from "../audio/MusicControl";
import { PerformanceDebug } from "../debug/PerformanceDebug";
import { PwaUpdatePrompt } from "../pwa/PwaUpdatePrompt";
import { useAudioUnlock } from "../../hooks/useAudioUnlock";
import { useBirthdayCelebration } from "../../hooks/useBirthdayCelebration";
import { useCelebrationPreload } from "../../hooks/useCelebrationPreload";

export function AppLayout() {
  const memory = useLocation().pathname === '/memories/2026';
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
