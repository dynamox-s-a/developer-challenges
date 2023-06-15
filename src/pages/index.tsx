import CreateMachineForm from "@/components/createMachineForm";
import MachineList from "@/components/MachineList";
import { ClipLoader } from "react-spinners";
import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import {
  setMachines,
  addUser,
  setUser,
} from "../../store/actions/machineActions";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@auth0/nextjs-auth0/client";
import { AppDispatch, RootState } from "../../store/store";
import { User } from "../types/types";

export default function Home() {
  const { user, error, isLoading } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const [machineExists, setMachineExists] = useState(true);
  const dbUser = useSelector((state: RootState) => state.machines.dbUser);
  const machines = useSelector((state: RootState) => state.machines.machines);
  const newMachineLoading = useSelector(
    (state: RootState) => state.machines.newMachineLoading
  );
  const [machinesLoading, setMachinesLoading] = useState(true);

  useEffect(() => {
    if (!user && !error && !isLoading) {
      window.location.assign(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`
      );
    }
  }, [user, error, isLoading]);

  useEffect(() => {
    if (!user) return;
    getUser();
  }, [user]);

  useEffect(() => {
    if (!dbUser) return;
    if (dbUser.id === null) return;
    getMachines();
  }, [dbUser]);

  async function getUser() {
    const res = await fetch(`/api/getUser/${user?.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const resUser = await res.json();
      dispatch(setUser(resUser));
    } else {
      createUser();
    }
  }

  const createUser = () => {
    if (typeof user?.email !== "string") {
      console.error("Invalid username or email");
      return;
    }
    const newUser: User = {
      email: user.email,
    };
    dispatch(addUser(newUser));
  };

  async function getMachines() {
    setMachinesLoading(true);
    let res;
    try {
      res = await fetch(`/api/getMachines/${dbUser.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        setMachinesLoading(false);
        setMachineExists(false);
      } else {
        const machinesRes = await res.json();
        console.log("machinesRes", machinesRes);
        setMachinesLoading(false);
        dispatch(setMachines(machinesRes));
        setMachineExists(true);
      }
    } catch (error) {
      console.error("Error occurred while fetching machines:", error);
      setMachinesLoading(false);
      setMachineExists(false);
    }
  }

  console.log("machine length", machines.length);

  return (
    <div className="px-8 py-8">
      <a className="py-8 mb-8 text-xl" href="/api/auth/logout">
        Logout
      </a>
      <h1 className="text-4xl mt-10">Machine Maker 2000</h1>
      <CreateMachineForm />
      <h1 className="text-2xl mb-8">Current Machines List:</h1>
      {machinesLoading ? (
        <Grid item xs={12} className="px-8">
          <div className="flex justify-evenly items-center bg-gray-200 px-8 border rounded border-gray-900 -mt-2">
            <ClipLoader className="h-12 w-12 my-12" />
          </div>
        </Grid>
      ) : null}
      {!machinesLoading && machines.length === 0 && !newMachineLoading ? (
        <h1 className="text-xl text-red-500">No machines created yet!</h1>
      ) : null}
      {machines.length > 0 || newMachineLoading ? <MachineList /> : null}
      <br />
      <a href="/MonitoringPointsList" className="py-4 text-2xl text-blue-500">
        See All Monitoring Points
      </a>
    </div>
  );
}
