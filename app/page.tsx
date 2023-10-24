"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectActiveComponent } from "../lib/redux/slices/pageSlice";
import { selectAuthToken } from "../lib/redux/slices/authSlice";
import API_BASE_URL from "./api/config";

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import TopCards from "./components/TopCards/TopCards";
import Profile from "./components/Profile/Profile";
import Machines from "./components/Machines/Machines";
import Dashboard from "./components/Dashboard/Dashboard";
import Sensors from "./components/Sensors/Sensors";
import LoginPage from "./components/Login/LoginPage";
import { setActiveComponent } from "../lib/redux/slices/pageSlice"

export default function IndexPage() {
  const dispatch = useDispatch();
  const activeComponent = useSelector(selectActiveComponent);
  const authToken = useSelector(selectAuthToken);
  const [controls, setControls] = useState([]);
  const [showDashboard, setShowDashboard] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/controls`)
      .then((response) => response.json())
      .then((data) => {
        setControls(data);
      })
      .catch((error) => console.error("Erro ao carregar os dados:", error));
  }, []);

  if (!authToken) {
    return <LoginPage />;
  }

  const handleComponentChange = (componentName: string) => {
    if (componentName !== "Dashboard") {
      setShowDashboard(false);
    } else {
      setShowDashboard(true);
    }
    dispatch(setActiveComponent(componentName));
  };

  return (
    <>
      <Sidebar handleComponentChange={handleComponentChange} setShowDashboard={setShowDashboard} />
      <Header />
      <TopCards />
      <div>
        {/* {activeComponent === "Dashboard" && <Dashboard controls={controls} />} */}
        {showDashboard && <Dashboard controls={controls} />}
        {activeComponent === "Sensors" && <Sensors />}
        {activeComponent === "Machines" && <Machines />}
        {activeComponent === "Profile" && <Profile />}
      </div>
    </>
  );
}
