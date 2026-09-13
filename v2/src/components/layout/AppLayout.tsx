import { Outlet } from "react-router-dom";
import { PerformanceDebug } from "../debug/PerformanceDebug";

export function AppLayout() {
  return (
    <main>
      <Outlet />
      {import.meta.env.DEV && <PerformanceDebug />}
    </main>
  );
}
