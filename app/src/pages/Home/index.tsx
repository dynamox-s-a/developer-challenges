import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import NavBar from "../../layout/Navbar";

import Machines from "../../layout/Machines";
import MonitoringPoints from "../../layout/monitoringPoints";
import { RootState } from "../../redux/store";
import { IUserState } from "../../redux/store/users/types";
import * as St from "./styles";

export default function Home() {
  const [tab, setTab] = useState<string>("machines");
  const isMobile = window.screen.width < 1024;
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(!isMobile);
  const navigate = useNavigate();
  const user: IUserState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    !user.isLogged && navigate("/");
  }, [navigate, user]);

  return (
    <St.Container>
      {isMobile && <Header openNavbar={setIsMenuOpen} />}
      {isMenuOpen && (
        <NavBar
          isMobile={isMobile}
          setTab={setTab}
          open={isMenuOpen}
          setOpen={setIsMenuOpen}
        />
      )}
      {tab === "machines" ? <Machines /> : <MonitoringPoints />}
    </St.Container>
  );
}
