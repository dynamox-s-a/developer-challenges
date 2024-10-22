import * as React from 'react';

import { Layout } from '../components/auth/layout';
import { SignUpForm } from '../components/auth/sign-up-form';


export function SignUp(): React.JSX.Element {
  React.useEffect(() => {
    document.title = `Sign up | Auth`;
  }, []);

  return (
    <Layout>
      <SignUpForm />
    </Layout>
  );
}