import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppStateProvider } from "../context/AppStateContext";
import { BirthdayProvider } from "../context/BirthdayContext";

export function App() {
  return (
    <AppStateProvider>
        <BirthdayProvider>
          <RouterProvider router={router} />
        </BirthdayProvider>
    </AppStateProvider>
  );
}
