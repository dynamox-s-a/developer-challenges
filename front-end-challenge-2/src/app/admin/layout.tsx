"use client";

import ProtectedRoute from "@/hocs/protected-route";
import AdminHeader from "./components/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminHeader />
      {children}
    </ProtectedRoute>
  );
}
