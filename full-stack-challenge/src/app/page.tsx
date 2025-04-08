"use client";

import withAuth from "../components/withAuth";
import MachineList from "@/components/machines/MachineList";

const HomePage = () => {
  return (
    <div>
      <MachineList />
    </div>
  );
};

export default withAuth(HomePage);
