import * as React from 'react';

import { GuestGuard } from '@/components/auth/guest-guard';

import { SignUpForm } from '@/components/auth/sign-up-form';

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <SignUpForm />
    </GuestGuard>
  );
}
