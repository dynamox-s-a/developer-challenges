import * as Sentry from "@sentry/react";
import { version } from '../../package.json';

export function initSentry() {
  if (import.meta.env.MODE !== 'production' || !import.meta.env.VITE_SENTRY_DSN) return;

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: version,
    sendDefaultPii: false,
  });
}
