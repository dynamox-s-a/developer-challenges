"use client";

import ProtectedRoute from "@/hocs/protected-route";
import EventsHeader from "./components/events-header";

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["reader", "admin"]}>
      <EventsHeader />
      {children}
    </ProtectedRoute>
  );
}
