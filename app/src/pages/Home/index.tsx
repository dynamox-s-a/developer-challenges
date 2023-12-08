import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import * as St from "./styles";

export default function Home() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    !user.isLogged && navigate("/");
  }, [navigate, user]);

  return (
    <St.MyHistory>
      <h1>Home</h1>
    </St.MyHistory>
  );
}
