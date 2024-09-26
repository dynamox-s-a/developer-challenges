import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.tsx";

export function useAuth() {
  return useContext(AuthContext);
}
