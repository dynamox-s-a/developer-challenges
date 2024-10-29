"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Machine {
    id: number;
    name: string;
    type: string;
}

export default function CreateMonitoringPoint() {
  const [name, setName] = useState("");
  const [machineId, setMachineId] = useState("");
  const [machines, setMachines] = useState<Machine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch("/api/machines", {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        });
        const data = await response.json();
        setMachines(data);
        if (data.length) setMachineId(data[0].id); 
      } catch (error) {
        console.error("Error fetching machines:", error);
      }
    };
    fetchMachines();
  }, []);

  const handleCreate = async () => {
    setError(null);

    if (name.length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    if (!machineId) {
      setError("Please select a machine.");
      return;
    }

    try {
      const response = await fetch("/api/monitoring-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ name, machineId }),
      });

      if (response.ok) {
        router.push("/monitoring-points");
      } else {
        const errorData = await response.json();
        console.log(errorData);
        alert(`Failed to create monitoring point:\n${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating point:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create Monitoring Point</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-4 w-full"
        required
      />
      <select
        value={machineId}
        onChange={(e) => setMachineId(e.target.value)}
        className="border p-2 mb-4 w-full"
        required
      >
        {machines.map((machine) => (
          <option key={machine.id} value={machine.id}>
            {machine.name}
          </option>
        ))}
      </select>
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white py-2 px-4 rounded mr-2"
        >
          Create
        </button>
        <button
          onClick={() => router.push("/monitoring-points")}
          className="bg-gray-400 text-white py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
