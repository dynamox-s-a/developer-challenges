import { tokenStorage } from "@/services/login/token-service";
import { clearUser } from "@/store/auth/slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import type { HeaderActions, HeaderModel } from "./types";

export function useHeaderController(): HeaderModel & HeaderActions {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.auth);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const handleLogout = () => {
		tokenStorage.remove();
		dispatch(clearUser());
		router.replace("/login");
	};

	const handleCreateEvent = () => {
		router.push("/events/create");
	};

	return {
		user,
		isMobile,
		handleLogout,
		handleCreateEvent,
	};
}
