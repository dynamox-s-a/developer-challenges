import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@web/app/store";

export type NotificationSeverity = "success" | "info" | "warning" | "error";

export interface Notification {
  id: string;
  message: string;
  severity: NotificationSeverity;
}

export interface NotificationsState {
  /** FIFO queue; only the first item is displayed. */
  queue: Notification[];
}

const initialState: NotificationsState = { queue: [] };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notify: {
      reducer(state, action: PayloadAction<Notification>) {
        state.queue.push(action.payload);
      },
      prepare(message: string, severity: NotificationSeverity = "success") {
        return { payload: { id: nanoid(), message, severity } };
      },
    },
    notificationDismissed(state, action: PayloadAction<string>) {
      state.queue = state.queue.filter(
        (notification) => notification.id !== action.payload,
      );
    },
  },
});

export const { notify, notificationDismissed } = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;

/** The notification currently on screen, if any. */
export const selectCurrentNotification = (
  state: RootState,
): Notification | null => state.notifications.queue[0] ?? null;
