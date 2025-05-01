export interface HeaderModel {
	user: {
		role?: string;
	} | null;
	isMobile: boolean;
}

export interface HeaderActions {
	handleLogout: () => void;
	handleCreateEvent: () => void;
}
