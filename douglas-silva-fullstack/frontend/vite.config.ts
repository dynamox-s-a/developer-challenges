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
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000', // Porta padrão para .NET
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      },
      port: 5173
    },
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, "./src/components"),
      },
    },
  };
});
