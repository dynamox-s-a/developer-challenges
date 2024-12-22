import { NotificationState } from "@/types/machines";
import { useState, useCallback } from "react";

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "info",
  });

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
