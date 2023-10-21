/* Components */
"use client";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import TopCards from "./components/TopCards/TopCards";
import Profile from "./components/Profile/Profile";
import Machines from "./components/Machines/Machines";
import Daschboard from "./components/Dashboard/Daschboard";
import Sensors from "./components/Sensors/Sensors";

import { useSelector } from "react-redux";
import { selectActiveComponent } from "../lib/redux/slices/pageSlice";

export default function IndexPage() {
  const activeComponent = useSelector(selectActiveComponent);
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
