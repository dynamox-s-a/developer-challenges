export const paths = {
  home: "/",
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
  },
  dashboard: {
    overview: "/dashboard",
    account: "/dashboard/account",
    machines: "/dashboard/machines",
    "monitoring-points": "/dashboard/monitoring-points",
    settings: "/dashboard/settings",
  },
  errors: { notFound: "/errors/not-found" },
} as const;
