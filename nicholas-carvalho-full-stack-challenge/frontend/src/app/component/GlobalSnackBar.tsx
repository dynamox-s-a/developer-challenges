"use client";

import { Alert, Snackbar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { hideToast } from "../redux/slices/snackSlice";

export default function GlobalSnackBar() {
    const dispatch = useAppDispatch();
    const { toast } = useAppSelector(state => state.snack);
    return (
        <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => dispatch(hideToast())} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
            <Alert onClose={() => dispatch(hideToast())} severity={toast.severity} variant="filled">{toast.message}</Alert>
        </Snackbar>
    )
}