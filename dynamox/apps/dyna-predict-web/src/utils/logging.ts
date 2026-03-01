import { captureException, type CaptureContext } from "@sentry/react"

export function logError(error: unknown, context?: CaptureContext) {
  captureException(error, context)
}
