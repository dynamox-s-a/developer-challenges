import * as React from 'react';

import { Layout } from '../components/auth/layout';
import { SignInForm } from '../components/auth/sign-in-form';

export function Login(): React.JSX.Element {
  React.useEffect(() => {
    document.title = `Sign in | Auth`;
  }, []);

  return (
    <Layout>
      <SignInForm />
    </Layout>
  );
}

