import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppStateProvider } from "../context/AppStateContext";
import { BirthdayProvider } from "../context/BirthdayContext";
import { PerformanceProvider } from "../context/PerformanceContext";

export function App() {
  return (
    <AppStateProvider>
      <PerformanceProvider>
        <BirthdayProvider>
          <RouterProvider router={router} />
        </BirthdayProvider>
      </PerformanceProvider>
    </AppStateProvider>
  );
}
