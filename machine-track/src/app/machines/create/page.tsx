"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const machineTypes = ["Pump", "Fan"];

export default function CreateMachine() {
  const [name, setName] = useState("");
  const [type, setType] = useState(machineTypes[0]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreate = async () => {
    setError(null);

    if (name.trim().length < 2) {
      setError("Name must have at least 2 characters.");
      return;
    }

    try {
      const response = await fetch("/api/machines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ name, type }),
      });

      if (response.ok) {
        router.push("/machines");
      } else {
        const errorData = await response.json();
        alert(`Failed to create machine:\n${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating machine:", error);
    }
  };

  return (
    <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Create Machine</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mb-2 w-full"
        />
        <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 mb-4 w-full"
        >
            {machineTypes.map((type) => (
            <option key={type} value={type}>
                {type}
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
                onClick={() => router.push("/machines")}
                className="bg-gray-400 text-white py-2 px-4 rounded"
            >
                Cancel
            </button>
        </div>
    </div>
  );
}
