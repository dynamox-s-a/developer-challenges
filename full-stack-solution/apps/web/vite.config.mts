/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const resolvePath = (relative: string) =>
  fileURLToPath(new URL(relative, import.meta.url));

const WORKSPACE_ROOT = resolvePath("../..");
const DEFAULT_API_TARGET = "http://localhost:3000";

/**
 * Vite configuration for the web app.
 *
 * Dev server: requests to `/api` are proxied to the Express API, so the browser
 * always talks to a single origin and no CORS configuration is needed.
 * In production the app is served behind a reverse proxy (or `VITE_API_URL`
 * points to the API origin — see `src/api/http-client.ts`).
 *
 * The proxy target is read with `loadEnv`, not from `process.env`: Vite does
 * not copy `.env` files into `process.env`, so reading it there would silently
 * ignore the value configured in the workspace `.env`.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, WORKSPACE_ROOT, "");

  return {
    root: resolvePath("."),
    envDir: WORKSPACE_ROOT,
    plugins: [react()],
    resolve: {
      alias: {
        "@web": resolvePath("./src"),
        "@full-stack-solution/shared": resolvePath(
          "../../libs/shared/src/index.ts",
        ),
      },
    },
    server: {
      port: 4200,
      host: "localhost",
      // The shared library lives outside the Vite root.
      fs: { allow: [WORKSPACE_ROOT] },
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || DEFAULT_API_TARGET,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: resolvePath("../../dist/apps/web"),
      emptyOutDir: true,
      sourcemap: true,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: [resolvePath("./src/test/setup.ts")],
      include: ["src/**/*.spec.{ts,tsx}"],
      css: false,
      restoreMocks: true,
      // The suite exercises the same-origin path the app uses behind the dev
      // server proxy, so the base URL is pinned empty here. Without this, a
      // developer with VITE_API_URL set in `.env` (pointing at a deployed API)
      // would see the URL assertions fail for reasons unrelated to their change.
      env: { VITE_API_URL: "" },
      // Worker threads start much faster than forked processes, which matters
      // when this suite shares the CPU with the database-backed API tests
      // (`nx run-many -t test`): with forks, workers were timing out before they
      // could respond.
      pool: "threads",
      // Transforms are cached on disk; without it every worker re-transforms the
      // whole module graph on every run.
      fsModuleCache: true,
      // The 5 s default is not enough under that shared load; rendering MUI
      // dialogs in jsdom is not fast.
      testTimeout: 20_000,
      hookTimeout: 20_000,
    },
  };
});
