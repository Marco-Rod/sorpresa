import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppStateProvider } from "../context/AppStateContext";
import { AudioProvider } from "../context/AudioContext";
import { BirthdayProvider } from "../context/BirthdayContext";
import { PerformanceProvider } from "../context/PerformanceContext";

export function App() {
  return (
    <AppStateProvider>
      <PerformanceProvider>
        <BirthdayProvider>
          <AudioProvider>
            <RouterProvider router={router} />
          </AudioProvider>
        </BirthdayProvider>
      </PerformanceProvider>
    </AppStateProvider>
  );
}
