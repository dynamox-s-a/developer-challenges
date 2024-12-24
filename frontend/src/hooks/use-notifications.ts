import { NotificationState } from "@/types/machines";
import { useState, useCallback } from "react";

/**
 * Custom hook for managing notification state.
 * @returns {Object} The hook returns an object containing:
 * - `notification`: The current notification state (open, message, severity).
 * - `showNotification`: A function to display a notification with a custom message and severity.
 * - `hideNotification`: A function to hide the currently shown notification.
 */
export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "info",
  });

  /**
   * Displays a notification with the given message and severity.
   * @param {string} message - The message to display in the notification.
   * @param {NotificationState['severity']} severity - The severity level of the notification (e.g., 'info', 'error', 'success').
   */
  const showNotification = useCallback(
    (message: string, severity: NotificationState["severity"] = "info") => {
      setNotification({
        open: true,
        message,
        severity,
      });
    },
    [],
  );

  /**
   * Hides the currently visible notification.
   */
  const hideNotification = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
  };
};