export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    machine: '/dashboard/machine',
    turbine: (id: number) => `/dashboard/turbines/${id}`,
  },
  errors: { notFound: '/errors/not-found' },
} as const;

