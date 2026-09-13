/* oxlint-disable react/only-export-components -- Keep the requested provider and consumer API together; edits to this module may trigger a full reload. */
import { createContext, useContext, type ReactNode } from "react";
import { useCountdown } from "../hooks/useCountdown";
import type { BirthdayPhase, CountdownState } from "../engines/birthdayEngine";

interface BirthdayContextValue {
  countdown: CountdownState;
  phase: BirthdayPhase;
}

const BirthdayContext = createContext<BirthdayContextValue | null>(null);
const BirthdayPhaseContext = createContext<BirthdayPhase | null>(null);

export function BirthdayProvider({ children }: { children: ReactNode }) {
  const birthday = useCountdown();
  return (
    <BirthdayPhaseContext.Provider value={birthday.phase}>
      <BirthdayContext.Provider value={birthday}>
        {children}
      </BirthdayContext.Provider>
    </BirthdayPhaseContext.Provider>
  );
}

export function useBirthday() {
  const context = useContext(BirthdayContext);
  if (!context) throw new Error("useBirthday must be used inside BirthdayProvider");
  return context;
}

// Static scenes subscribe only to phase changes, not quarter-second ticks.
export function useBirthdayPhase() {
  const phase = useContext(BirthdayPhaseContext);
  if (!phase) throw new Error("useBirthdayPhase must be used inside BirthdayProvider");
  return phase;
}
