/**
 * Single source of truth for application routes.
 *
 * Keeping the strings here prevents navigation links and the router definition
 * from drifting apart.
 */
export const paths = {
  login: "/login",
  overview: "/",
  machines: "/machines",
  monitoringPoints: "/monitoring-points",
  timeSeries: "/time-series",
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];
