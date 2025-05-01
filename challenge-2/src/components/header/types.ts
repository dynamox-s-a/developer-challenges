export interface HeaderModel {
	user: {
		role?: string;
	} | null;
	isMobile: boolean;
	anchorEl: HTMLElement | null;
}

export interface HeaderActions {
	handleLogout: () => void;
	handleCreateEvent: () => void;
	handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
	handleMenuClose: () => void;
	handleLogoutClick: () => void;
	handleCreateEventClick: () => void;
}
