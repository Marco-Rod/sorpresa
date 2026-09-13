import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppStateProvider } from "../context/AppStateContext";
import { AudioProvider } from "../context/AudioContext";
import { BirthdayProvider } from "../context/BirthdayContext";
import { CelebrationProvider } from "../context/CelebrationContext";
import { PerformanceProvider } from "../context/PerformanceContext";

export function App() {
  return (
    <AppStateProvider>
      <PerformanceProvider>
        <BirthdayProvider>
          <AudioProvider>
            <CelebrationProvider>
              <RouterProvider router={router} />
            </CelebrationProvider>
          </AudioProvider>
        </BirthdayProvider>
      </PerformanceProvider>
    </AppStateProvider>
  );
}
