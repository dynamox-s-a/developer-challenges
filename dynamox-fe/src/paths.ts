export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    registerMachines: '/dashboard/register-machines',
    registerMonitoringPoints: '/dashboard/register-monitoring-points',
    listMonitoringPoints: '/dashboard/list-monitoring-points',
    listMachines: '/dashboard/list-machines'
  },
} as const;
