import { tokenStorage } from "@/services/login/token-service";
import { clearUser } from "@/store/auth/slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { HeaderActions, HeaderModel } from "./types";

export function useHeaderController(): HeaderModel & HeaderActions {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.auth);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleLogout = () => {
		tokenStorage.remove();
		dispatch(clearUser());
		router.replace("/login");
	};

	const handleCreateEvent = () => {
		router.push("/events/create");
	};

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogoutClick = () => {
		handleMenuClose();
		handleLogout();
	};

	const handleCreateEventClick = () => {
		handleMenuClose();
		handleCreateEvent();
	};

	return {
		user,
		isMobile,
		anchorEl,
		handleLogout,
		handleCreateEvent,
		handleMenuOpen,
		handleMenuClose,
		handleLogoutClick,
		handleCreateEventClick,
	};
}
