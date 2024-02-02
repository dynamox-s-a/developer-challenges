import type { ReduxState } from "@/lib/redux";

export const selectMonitoringPoints = (state: ReduxState) => state.monitoringPoints;
