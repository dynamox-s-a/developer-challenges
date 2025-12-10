"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth";
import { AppLayout } from "@/components/layout";

interface EventsLayoutProps {
  children: ReactNode;
}

export default function EventsLayout({ children }: EventsLayoutProps) {
  // Both admin and reader can access events
  return (
    <ProtectedRoute allowedRoles={["admin", "reader"]}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}
