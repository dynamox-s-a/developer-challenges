"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export function AuthRedirect() {
	const router = useRouter();
	const { isAuthenticated, isInitialized } = useAppSelector(
		(state) => state.auth,
	);

	useEffect(() => {
		if (!isInitialized) return;

		if (isAuthenticated) {
			router.replace("/events");
		}
	}, [router, isAuthenticated, isInitialized]);

	return null;
}
