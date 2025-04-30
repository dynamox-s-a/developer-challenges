"use client";
import { RouteGuard } from "@/components/route-guard";
import { useAppSelector } from "@/store/hooks";
import { Button, Container, Typography } from "@mui/material";
import Link from "next/link";

export default function EventsPage() {
	const { user } = useAppSelector((state) => state.auth);

	return (
		<RouteGuard allowedRoles={["reader", "admin"]}>
			<Container maxWidth="lg" className="py-8">
				<div className="flex justify-between items-center mb-6">
					<Typography variant="h4" component="h1">
						Eventos
					</Typography>
					{user?.role === "admin" && (
						<Link href="/events/create" passHref>
							<Button variant="contained" color="primary">
								Criar Evento
							</Button>
						</Link>
					)}
				</div>
			</Container>
		</RouteGuard>
	);
}
