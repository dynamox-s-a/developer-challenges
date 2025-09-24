/**
 * Application routes and navigation paths
 */

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  ADMIN: {
    ROOT: "/admin",
    EVENTS: {
      ROOT: "/admin/events",
      ADD: "/admin/events/add",
      EDIT: (id: string) => `/admin/events/edit/${id}`,
    },
  },
} as const;
