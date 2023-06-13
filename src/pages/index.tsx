import CreateMachineForm from "@/components/createMachineForm";
import MachineList from "@/components/MachineList";
import { ClipLoader } from "react-spinners";
import React, { useState, useEffect } from "react";
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
  const [machinesLoading, setMachinesLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const dbUser = useSelector((state: RootState) => state.machines.dbUser);

  useEffect(() => {
    if (!user && !error && !isLoading) {
      window.location.assign(`http://localhost:3000/api/auth/login`);
    }
    console.log("the auth user", user);
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
      console.log("resuser", resUser);
      dispatch(setUser(resUser));
    } else {
      console.log("not okay");
      createUser();
    }
  }

  const createUser = () => {
    if (typeof user?.email !== "string") {
      console.error("Invalid username or email");
      return;
    }
    console.log("were creating a user");
    const newUser: User = {
      email: user.email,
    };
    dispatch(addUser(newUser));
  };

  async function getMachines() {
    let res;
    try {
      res = await fetch(`/api/getMachines/${dbUser.id}`, {
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

  return (
    <div className="px-8 py-8">
      <h1 className="text-4xl">Machine Maker 2000</h1>
      <CreateMachineForm />
      <h1 className="text-2xl mb-8">Current Machines List:</h1>
      {machinesLoading ? <ClipLoader className="h-10 w-10" /> : <MachineList />}
      <br />
      <a href="/MonitoringPointsList" className="py-4 text-2xl text-blue-500">
        See All Monitoring Points
      </a>
    </div>
  );
}
