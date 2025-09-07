// src/ui/theme/globals.tsx
import GlobalStyles from "@mui/material/GlobalStyles";

export function AppGlobalStyles() {
  return (
    <GlobalStyles
      styles={{
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },

        body: {
          margin: 0,
          minHeight: "100vh",
          background: "#0b0f19",
          color: "#f5f5f5",
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        },

        "#root": {
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    />
  );
}
