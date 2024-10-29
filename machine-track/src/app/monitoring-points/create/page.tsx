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
  const router = useRouter();

  useEffect(() => {
    // Carregar máquinas do banco
    const fetchMachines = async () => {
      try {
        const response = await fetch("/api/machines", {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        });
        const data = await response.json();
        setMachines(data);
        if (data.length) setMachineId(data[0].id); // Definir o primeiro como valor padrão
      } catch (error) {
        console.error("Error fetching machines:", error);
      }
    };
    fetchMachines();
  }, []);

  const handleCreate = async () => {
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
        alert(`Failed to create monitoring point:\n${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating point:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create Monitoring Point</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <select
        value={machineId}
        onChange={(e) => setMachineId(e.target.value)}
        className="border p-2 mb-4 w-full"
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
