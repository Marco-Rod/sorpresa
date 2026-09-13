import { Outlet } from "react-router-dom";

import { MusicControl } from "../audio/MusicControl";
import { PerformanceDebug } from "../debug/PerformanceDebug";
import { useAudioUnlock } from "../../hooks/useAudioUnlock";
import { useBirthdayCelebration } from "../../hooks/useBirthdayCelebration";

export function AppLayout() {
  useAudioUnlock();
  useBirthdayCelebration();

  return (
    <main>
      <Outlet />

      <MusicControl />

      {import.meta.env.DEV && <PerformanceDebug />}
    </main>
  );
}
