export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up' },
  dashboard: {
    overview: '/dashboard',
    machines: '/dashboard/machines',
    monitoring_points: '/dashboard/monitoring-points',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
