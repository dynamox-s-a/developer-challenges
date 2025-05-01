"use client";
import { RouteGuard } from "@/components/route-guard";
import { Header } from "@/components/header";
import { Container, Typography } from "@mui/material";

export default function CreateEventPage() {
	return (
		<RouteGuard allowedRoles={["admin"]}>
			<Header />
			<Container maxWidth="lg" className="py-8">
				<Typography variant="h4" component="h1" className="mb-6">
					Criar Novo Evento
				</Typography>
			</Container>
		</RouteGuard>
	);
}
