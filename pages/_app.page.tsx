import React from "react";
import { Provider } from "react-redux";
import store from "redux/store";
import type { AppProps } from "next/app";
import Layout from "components/layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
