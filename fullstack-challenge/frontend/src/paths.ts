export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    machines: '/dashboard/machines',
    monitoring: '/dashboard/monitoring-points',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
