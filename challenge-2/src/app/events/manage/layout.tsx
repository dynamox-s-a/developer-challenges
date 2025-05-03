"use client";

import { RouteGuard } from "@/components/route-guard";

export default function ManageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<RouteGuard allowedRoles={["admin"]}>
			{children}
		</RouteGuard>
	);
}
