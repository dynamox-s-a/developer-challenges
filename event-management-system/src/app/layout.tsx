"use client";

import { ThemeProvider } from "@mui/material/styles";
import "./globals.css";
import theme from "@/theme/theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
