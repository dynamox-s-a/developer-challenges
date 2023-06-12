import CreateMachineForm from "@/components/createMachineForm";
import MachineList from "@/components/MachineList";
import { ClipLoader } from "react-spinners";
import React, { useState, useEffect } from "react";
import { setMachines } from "../../store/actions/machineActions";
import { useDispatch } from "react-redux";

export default function Home() {
  const [machinesLoadidng, setMachinesLoading] = useState(true);
  const dispatch = useDispatch();

  async function getMachines() {
    let res;
    try {
      res = await fetch(`/api/getMachines/1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error(error);
    } finally {
      const machinesRes = await res?.json();
      setMachinesLoading(false);
      dispatch(setMachines(machinesRes));
    }
  }

  useEffect(() => {
    getMachines();
  }, []);

  return (
    <>
      <h1 className="text-4xl">Machine Maker 2000</h1>
      <CreateMachineForm />
      <h1 className="text-2xl mb-8">Current Machines List:</h1>
      {machinesLoadidng ? (
        <ClipLoader className="h-10 w-10" />
      ) : (
        <MachineList />
      )}
    </>
  );
}
