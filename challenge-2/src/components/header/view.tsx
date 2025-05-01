import { AppBar, Button, Container, Toolbar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HeaderActions, HeaderModel } from "./types";

interface HeaderViewProps extends HeaderModel, HeaderActions {}

export function HeaderView({
	user,
	isMobile,
	handleLogout,
	handleCreateEvent,
}: HeaderViewProps) {
	const pathname = usePathname();

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

					<div className="flex gap-4">
						{user?.role === "admin" && pathname !== "/events/create" && (
							<Link href="/events/create" passHref>
								<Button
									variant="contained"
									style={{ background: "var(--color-primary)" }}
									onClick={handleCreateEvent}
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
				</Toolbar>
			</Container>
		</AppBar>
	);
}
