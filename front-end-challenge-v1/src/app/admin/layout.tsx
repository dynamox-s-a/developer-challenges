"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth";
import { AppLayout } from "@/components/layout";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}
