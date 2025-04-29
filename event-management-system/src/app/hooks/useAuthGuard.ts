"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "../constants/roles";

export const useAuthGuard = (
  requiredRole: (typeof ROLES)[keyof typeof ROLES]
) => {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role || role !== requiredRole) {
      router.push("/login");
    }
  }, [requiredRole, router]);
};
