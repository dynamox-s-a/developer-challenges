import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "redux/store";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "components/layout/Layout";
import { hasSession } from "lib/auth/auth";
import { AuthGuard } from "hocs/auth-guard";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </Provider>
  );
}
