import useLocalStorage from "../hooks/useLocalStorage";
import {  Navigate } from "react-router-dom";

export default function ProtectedRouteGuard({ children }) {
  const [storedValue] = useLocalStorage("desafio02/barbara-rech", "");
  const token = storedValue.accessToken;

  if (!token) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
