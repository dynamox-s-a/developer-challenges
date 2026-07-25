import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/highcharts") || id.includes("node_modules/@highcharts")) {
            return "highcharts";
          }
          if (
            id.includes("node_modules/@mui") ||
            id.includes("node_modules/@emotion")
          ) {
            return "mui";
          }
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/redux")
          ) {
            return "react-vendor";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  preview: {
    port: 4173,
  },
});
