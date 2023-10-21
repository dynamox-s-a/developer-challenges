/* Components */
"use client";

import { useSelector } from "react-redux";
import { selectActiveComponent } from "../lib/redux/slices/pageSlice";
import { selectAuthToken } from "../lib/redux/slices/authSlice";
import { selectUserId } from "../lib/redux/slices/authSlice";

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import TopCards from "./components/TopCards/TopCards";
import Profile from "./components/Profile/Profile";
import Machines from "./components/Machines/Machines";
import Daschboard from "./components/Dashboard/Daschboard";
import Sensors from "./components/Sensors/Sensors";
import LoginPage from "./components/Login/LoginPage";

export default function IndexPage() {
  const activeComponent = useSelector(selectActiveComponent);
  const authToken = useSelector(selectAuthToken);
  const userId = useSelector(selectUserId);

  if (!authToken) {
    // Se o usuário não estiver autenticado, renderize a tela de login.
    return <LoginPage />;
  }

  return (
    <>
      <Sidebar />
      <Header />
      <TopCards />
      <div>
        {activeComponent === "Daschboard" && <Daschboard />}
        {activeComponent === "Sensors" && <Sensors />}
        {activeComponent === "Machines" && <Machines />}
        {activeComponent === "Profile" && <Profile />}
      </div>
    </>
  );
}
