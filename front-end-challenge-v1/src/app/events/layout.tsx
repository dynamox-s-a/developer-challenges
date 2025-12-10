"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth";

interface EventsLayoutProps {
  children: ReactNode;
}

export default function EventsLayout({ children }: EventsLayoutProps) {
  // Both admin and reader can access events
  return (
    <ProtectedRoute allowedRoles={["admin", "reader"]}>
      {children}
    </ProtectedRoute>
  );
}
