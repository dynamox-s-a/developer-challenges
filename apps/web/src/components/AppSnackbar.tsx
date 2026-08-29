import { Alert, Snackbar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { dismissNotification } from "../features/notifications/notificationsSlice";

const AUTO_HIDE_MS = 4000;

// Mounted once in the app shell: every successful mutation surfaces here, never per page.
export function AppSnackbar() {
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.notifications.current);

  return (
    <Snackbar
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      autoHideDuration={AUTO_HIDE_MS}
      key={notification?.key}
      onClose={(_, reason) => {
        if (reason !== "clickaway") {
          dispatch(dismissNotification());
        }
      }}
      open={Boolean(notification)}
    >
      <Alert
        onClose={() => dispatch(dismissNotification())}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
}
