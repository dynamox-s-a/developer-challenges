import { useAppDispatch } from "../../app/hooks";
import { ProtectedRoute } from "../security/ProtectedRoute";
import { logout } from "../user/userSlice";

export function Home() {
  const dispatch = useAppDispatch();

  return (
    <ProtectedRoute>
      <div>home</div>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </ProtectedRoute>
  );
}
