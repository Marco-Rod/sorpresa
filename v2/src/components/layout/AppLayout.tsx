import { Outlet } from "react-router-dom";

import { MusicControl } from "../audio/MusicControl";
import { PerformanceDebug } from "../debug/PerformanceDebug";
import { useAudioUnlock } from "../../hooks/useAudioUnlock";

export function AppLayout() {
  useAudioUnlock();

  return (
    <main>
      <Outlet />

      <MusicControl />

      {import.meta.env.DEV && <PerformanceDebug />}
    </main>
  );
}
