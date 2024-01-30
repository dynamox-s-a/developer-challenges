"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

// "loading" | "authenticated" | "unauthenticated"

export default function Home() {
  const { data: session, status } = useSession();
  if (status === "loading") return "Loading.........";
  if (status === "unauthenticated") redirect("/login");
  redirect("/dashboard");
}
