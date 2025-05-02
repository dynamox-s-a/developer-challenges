"use client";
import { Alert, Snackbar } from "@mui/material";

interface NotificationProps {
	open: boolean;
	message: string;
	severity: "success" | "error";
	onClose: () => void;
}

export default function Notification({
	open,
	message,
	severity,
	onClose,
}: NotificationProps) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={4000}
			onClose={onClose}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
		>
			<Alert onClose={onClose} severity={severity} variant="filled">
				{message}
			</Alert>
		</Snackbar>
	);
}
