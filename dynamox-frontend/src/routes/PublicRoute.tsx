import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAppSelector((state) => state.auth.token);
  return token ? <Navigate to="/monitoring-points" /> : children;
};
