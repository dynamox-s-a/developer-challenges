"use client";

import { tokenStorage } from "@/services/login/token-service";
import { clearUser } from "@/store/auth/slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import MenuIcon from "@mui/icons-material/Menu";
import {
	AppBar,
	Button,
	Container,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
	const router = useRouter();
	const pathname = usePathname();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.auth);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		tokenStorage.remove();
		dispatch(clearUser());
		router.replace("/login");
		handleClose();
	};

	const handleCreateEvent = () => {
		router.push("/events/create");
		handleClose();
	};

	return (
		<AppBar position="static" color="default" elevation={1}>
			<Container maxWidth="lg">
				<Toolbar
					className={`flex ${isMobile ? "justify-center" : "justify-between"} items-center py-2 relative`}
				>
					<Link href="/events" className="flex items-center">
						<Image
							src="/logo-dynamox.png"
							alt="Dynamox Logo"
							width={120}
							height={40}
							priority
						/>
					</Link>

					{isMobile ? (
						<div className="absolute right-0">
							<IconButton
								size="large"
								aria-label="menu"
								aria-controls={open ? "menu-appbar" : undefined}
								aria-haspopup="true"
								onClick={handleMenu}
								color="inherit"
							>
								<MenuIcon className="text-primary" />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								open={open}
								onClose={handleClose}
							>
								{user?.role === "admin" && pathname !== "/events/create" && (
									<MenuItem onClick={handleCreateEvent}>Criar Evento</MenuItem>
								)}
								<MenuItem onClick={handleLogout}>Sair</MenuItem>
							</Menu>
						</div>
					) : (
						<div className="flex gap-4">
							{user?.role === "admin" && pathname !== "/events/create" && (
								<Link href="/events/create" passHref>
									<Button
										variant="contained"
										style={{ background: "var(--color-primary)" }}
									>
										Criar Evento
									</Button>
								</Link>
							)}
							<Button
								variant="outlined"
								style={{
									borderColor: "var(--color-primary)",
									color: "var(--color-primary)",
								}}
								onClick={handleLogout}
							>
								Sair
							</Button>
						</div>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
}
