import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Provider } from "react-redux";
import { AppProps } from "next/app";
import { store } from "../../store/store";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </UserProvider>
  );
}
