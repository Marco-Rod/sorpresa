/* oxlint-disable react/only-export-components -- Keep the requested provider and consumer API together; edits to this module may trigger a full reload. */
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { usePageVisibility } from "../hooks/usePageVisibility";

const AppStateContext = createContext<{ isVisible: boolean } | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const isVisible = usePageVisibility();
  const value = useMemo(() => ({ isVisible }), [isVisible]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used inside AppStateProvider");
  return context;
}
