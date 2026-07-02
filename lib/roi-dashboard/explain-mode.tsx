import { createContext, useContext, type ReactNode } from "react";

type ExplainCtx = { explainMode: boolean };
const ExplainModeContext = createContext<ExplainCtx>({ explainMode: false });

export function ExplainModeProvider({ explainMode, children }: { explainMode: boolean; children: ReactNode }) {
  return <ExplainModeContext.Provider value={{ explainMode }}>{children}</ExplainModeContext.Provider>;
}

export function useExplainMode() {
  return useContext(ExplainModeContext).explainMode;
}
