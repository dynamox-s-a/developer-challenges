import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../user/userSlice";

export function ProtectedRoute(props: PropsWithChildren) {
  const user = useAppSelector(selectUser);

  if (!user || user.status === "logged-out") {
    return <Navigate to="/" replace />;
  }

  return <>{props.children}</>;
}
