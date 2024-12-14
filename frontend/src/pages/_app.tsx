import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { darkTheme, lightTheme } from "@/styles/theme";

const ThemeContext = React.createContext({
  isDarkMode: true,
  toggleTheme: () => {},
});

function MyApp({ Component, pageProps }: AppProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ThemeContext.Provider>
    </SessionProvider>
  );
}

export default MyApp;
