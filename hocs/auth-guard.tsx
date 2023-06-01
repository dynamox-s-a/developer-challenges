import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "components/layout/Layout";
import { getBrowserSession, hasSession } from "lib/auth/auth";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setSession } from "redux/reducers/sessionReducer";

interface Props {
  children: ReactElement;
}

export const AuthGuard = (props: Props): ReactElement | null => {
  const { children } = props;
  const session = useAppSelector((state) => state.sessionReducer.session);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isBrowser = typeof window !== "undefined";
  const isLogin = router.pathname === "/login";
  const [logedIn, setLogedIn] = useState(false);
  const [routerIsReady, setRouterIsReady] = useState(false);

  useEffect(() => {
    if (isBrowser && !session) {
      setLogedIn(hasSession());
      if (logedIn) {
        dispatch(setSession(getBrowserSession()));
      }
    }
  }, [logedIn]);

  useEffect(() => {
    if (router.isReady) {
      setRouterIsReady(true);
    }
  }, [router.isReady]);

  if (!routerIsReady) return null;

  if (isBrowser && !isLogin && !logedIn) {
    router.push("/login");
    return null;
  } else if (isLogin && logedIn) {
    router.push("/");
    return null;
  } else {
    return !logedIn ? children : <Layout>{children}</Layout>;
  }
};
