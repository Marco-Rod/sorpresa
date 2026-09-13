import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppStateProvider } from "../context/AppStateContext";
import { AmbientEventProvider } from "../context/AmbientEventContext";
import { AudioProvider } from "../context/AudioContext";
import { BirthdayProvider } from "../context/BirthdayContext";
import { CelebrationProvider } from "../context/CelebrationContext";
import { DevToolsProvider } from "../context/DevToolsContext";
import { PerformanceProvider } from "../context/PerformanceContext";

export function App() {
  return (
    <DevToolsProvider>
      <AppStateProvider>
        <PerformanceProvider>
          <BirthdayProvider>
            <AudioProvider>
              <CelebrationProvider>
                <AmbientEventProvider>
                  <RouterProvider router={router} />
                </AmbientEventProvider>
              </CelebrationProvider>
            </AudioProvider>
          </BirthdayProvider>
        </PerformanceProvider>
      </AppStateProvider>
    </DevToolsProvider>
  );
}
