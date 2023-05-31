import React, { ReactElement } from "react";
import Head from "next/head";
import Header from "./Header";
import Navigation from "./Navigation";
import { useRouter } from "next/router";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

const routeTitles: Record<string, string> = {
  "/": "Home",
  "/login": "Login",
  "/login/admin": "Login",
  "/devices": "Devices",
  "/storages": "Storages",
  "/users": "Usuários",
  "/organizations": "Organizations",
  "/groups": "Grupos",
};

interface Props {
  children: React.ReactNode;
}

const defaultTheme = createTheme();

export default function Layout({ children }: Props): ReactElement {
  const router = useRouter();
  // const title = routeTitles[router.pathname] || "";

  const isLoginPage = router.pathname === "/login";
  const logedIn = true;

  if (!logedIn && !isLoginPage) {
    router.push("/login");
  } else if (logedIn && isLoginPage) {
    router.push("/");
  }

  if (!isLoginPage)
    return (
      <>
        <Head>
          {/* <title>{`${title || "404"}`}</title> */}
          <title>{"teste"}</title>
        </Head>
        <ThemeProvider theme={defaultTheme}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Navigation />
            <Header title={"teste"} />
            {children}
          </Box>
        </ThemeProvider>
      </>
    );
  else return <>{children}</>;
}
