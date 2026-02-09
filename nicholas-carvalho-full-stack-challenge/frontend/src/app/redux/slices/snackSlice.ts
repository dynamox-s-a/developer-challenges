import { snackType } from "@/app/types/enum";
import { snackBarState } from "@/app/types/snack";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: snackBarState = {
    toast: { open: false, message: "", severity: snackType.success }
};

export const snackSlice = createSlice({
    name: "snack",
    initialState,
    reducers: {
        showToast: (state, { payload }: PayloadAction<{ message: string, severity?: snackBarState["toast"]["severity"] }>) => {
            state.toast = {
                open: true,
                message: payload.message,
                severity: payload.severity || snackType.success
            }
        },
        hideToast: (state) => {
            state.toast.open = false;
        }
    }
});

export const { showToast, hideToast } = snackSlice.actions;
export default snackSlice.reducer;