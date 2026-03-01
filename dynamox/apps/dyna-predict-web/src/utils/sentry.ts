import * as Sentry from "@sentry/react";

export function initSentry() {
  if (import.meta.env.MODE === 'production') {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        sendDefaultPii: true,
      })
    }
}
