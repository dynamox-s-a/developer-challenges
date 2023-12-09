import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { logout } from "../../redux/store/users/userSlice";
import * as St from "./styles";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    !user.isLogged && navigate("/");
  }, [navigate, user]);

  return (
    <St.MyHistory>
      <h1>Home</h1>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </St.MyHistory>
  );
}
