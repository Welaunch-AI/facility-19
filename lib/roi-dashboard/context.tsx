"use client";

import { createContext, useContext, type ReactNode } from "react";

type RoiDashboardContextValue = {
  workspaceId: string;
  basePath: string;
};

const RoiDashboardContext = createContext<RoiDashboardContextValue | null>(null);

export function RoiDashboardProvider({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: ReactNode;
}) {
  const basePath = `/workspaces/${workspaceId}/dashboard`;

  return (
    <RoiDashboardContext.Provider value={{ workspaceId, basePath }}>
      {children}
    </RoiDashboardContext.Provider>
  );
}

export function useRoiDashboard() {
  const ctx = useContext(RoiDashboardContext);
  if (!ctx) {
    throw new Error("useRoiDashboard must be used within RoiDashboardProvider");
  }
  return ctx;
}
