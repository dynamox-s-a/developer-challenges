import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useAppDispatch, useAppSelector } from "@web/app/hooks";
import {
  notificationDismissed,
  selectCurrentNotification,
} from "@web/features/notifications/notifications.slice";

/**
 * Displays the first queued notification.
 *
 * Mounted once in the layout: features only have to dispatch `notify(...)`.
 */
export function AppSnackbar() {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(selectCurrentNotification);

  const handleClose = () => {
    if (notification) {
      dispatch(notificationDismissed(notification.id));
    }
  };

  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity={notification?.severity ?? "info"}
        onClose={handleClose}
        variant="filled"
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
}
