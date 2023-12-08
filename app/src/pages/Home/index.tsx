import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as St from "./styles";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    window.localStorage.getItem("isLogged") === "false" && navigate("/");
  }, [navigate]);

  return (
    <St.MyHistory>
      <h1>Home</h1>
    </St.MyHistory>
  );
}
