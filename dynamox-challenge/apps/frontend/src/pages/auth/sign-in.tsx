import * as React from 'react';

import { GuestGuard } from '@/components/auth/guest-guard';

import { SignInForm } from '@/components/auth/sign-in-form';

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <SignInForm />
    </GuestGuard>
  );
}
