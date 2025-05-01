"use client";

import { RouteGuard } from "@/components/route-guard";
import { Header } from "@/components/header";

export default function EventsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<RouteGuard allowedRoles={["reader", "admin"]}>
			<Header />
			{children}
		</RouteGuard>
	);
}
