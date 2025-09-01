import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      "process.env": env,
      global: {},
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, "./src/components"),
      },
    },
  };
});
