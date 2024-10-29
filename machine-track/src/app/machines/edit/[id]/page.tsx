"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";

const machineTypes = ["Pump", "Fan"];

export default function EditMachine() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const response = await fetch(`/api/machines/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const data = await response.json();
        setName(data.name);
        setType(data.type);
      } catch (error) {
        console.error("Error fetching machine:", error);
      }
    };

    fetchMachine();
  }, [id]);

  const handleUpdate = async () => {
    setError(null);

    if (name.trim().length < 2) {
      setError("Name must have at least 2 characters.");
      return;
    }

    try {
      await fetch(`/api/machines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ name, type }),
      });

      router.push("/machines");
    } catch (error) {
      console.error("Error updating machine:", error);
    }
  };

  return (
    <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Edit Machine</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <input
            type="text"
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
        <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white py-2 px-4 rounded"
        >
            Update
        </button>
    </div>
  );
}
