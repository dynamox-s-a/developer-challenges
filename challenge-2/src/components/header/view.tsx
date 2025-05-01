import { AppBar, Button, Container, IconButton, Toolbar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { usePathname } from "next/navigation";
import type { HeaderActions, HeaderModel } from "./types";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";

interface HeaderViewProps extends HeaderModel, HeaderActions {}

export function HeaderView({
	user,
	isMobile,
	anchorEl,
	handleLogout,
	handleCreateEvent,
	handleMenuOpen,
	handleMenuClose,
	handleLogoutClick,
	handleCreateEventClick,
}: HeaderViewProps) {
	const pathname = usePathname();

	return (
		<AppBar position="static" color="default" elevation={1}>
			<Container maxWidth="lg">
				<Toolbar
					sx={{ justifyContent: isMobile ? "space-between" : "space-between" }}
				>
					{isMobile && (
						<IconButton
							size="large"
							edge="start"
							color="primary"
							onClick={handleMenuOpen}
						>
							<MenuIcon
								sx={{
									color: "var(--color-primary)",
								}}
							/>
						</IconButton>
					)}

					<Link href="/events" style={{ margin: isMobile ? "0 auto" : "0" }}>
						<Image
							src="/logo-dynamox.png"
							alt="Dynamox Logo"
							width={120}
							height={40}
							priority
						/>
					</Link>

					{!isMobile && (
						<div className="flex gap-4">
							{user?.role === "admin" && pathname !== "/events/manage" && (
								<Link href="/events/manage" passHref>
									<Button
										variant="contained"
										color="primary"
										startIcon={<SettingsIcon />}
										onClick={handleCreateEvent}
										sx={{
											backgroundColor: "var(--color-primary)",
										}}
									>
										Gerenciar Eventos
									</Button>
								</Link>
							)}
							<Button
								variant="outlined"
								startIcon={<LogoutIcon />}
								onClick={handleLogout}
								sx={{
									borderColor: "var(--color-primary)",
									color: "var(--color-primary)",
								}}
							>
								Sair
							</Button>
						</div>
					)}

					{isMobile && (
						<IconButton
							size="large"
							edge="end"
							color="primary"
							sx={{
								visibility: "hidden",
							}}
						>
							<MenuIcon />
						</IconButton>
					)}

					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleMenuClose}
						sx={{
							mt: 1.5,
							width: 200,
						}}
					>
						{user?.role === "admin" && pathname !== "/events/manage" && (
							<Link
								href="/events/manage"
								passHref
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<MenuItem
									onClick={handleCreateEventClick}
									sx={{
										color: "var(--color-primary)",
									}}
								>
									Gerenciar Eventos
								</MenuItem>
							</Link>
						)}
						<MenuItem
							onClick={handleLogoutClick}
							sx={{ color: "var(--color-primary)" }}
						>
							<LogoutIcon sx={{ mr: 1 }} />
							Sair
						</MenuItem>
					</Menu>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
