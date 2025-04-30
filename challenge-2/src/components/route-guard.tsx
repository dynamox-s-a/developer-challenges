"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RouteGuardProps {
	children: React.ReactNode;
	allowedRoles?: string[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
	const router = useRouter();
	const { user, isAuthenticated, isInitialized } = useAppSelector(
		(state) => state.auth,
	);

	useEffect(() => {
		if (!isInitialized) return;

		if (!isAuthenticated || !user) {
			router.replace("/login");
			return;
		}

		if (allowedRoles && !allowedRoles.includes(user.role)) {
			router.replace("/events");
			return;
		}
	}, [router, allowedRoles, isAuthenticated, isInitialized, user]);

	return <>{children}</>;
}
