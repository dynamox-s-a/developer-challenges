export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up' },
  machine: {
    list: '/machine',
    detail: (id: number) => `/machine/${id}`,
  },
  monitoringPoints: '/monitoring-points',
  account: '/account',
  errors: { notFound: '/errors/not-found' },
} as const;

