export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {  
    machines: '/dashboard/machines',
    edit_machine: '/dashboard/machines/edit',
    monitoring_point: '/dashboard/monitoring-point',
    edit_monitoring_point: '/dashboard/monitoring-point/edit'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
