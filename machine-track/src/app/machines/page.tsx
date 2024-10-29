"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface Machine {
  id: number;
  name: string;
  type: string;
}

export default function Machines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch("/api/machines", {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch machines: ${response.statusText}`);
        }

        const data = await response.json();
        setMachines(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/machines/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      setMachines((prev) => prev.filter((machine) => machine.id !== id));
    } catch (err) {
      console.error("Failed to delete machine:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    alert(`Error: ${error}`);
    router.push("/");
  }

  return (
    <div>
      <NavBar />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Machines</h1>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((machine) => (
              <tr key={machine.id}>
                <td className="border px-4 py-2 text-center">{machine.id}</td>
                <td className="border px-4 py-2 text-center">{machine.name}</td>
                <td className="border px-4 py-2 text-center">{machine.type}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => router.push(`/machines/edit/${machine.id}`)}
                    className="bg-blue-500 text-white px-2 py-1 mr-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(machine.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => router.push("/machines/create")}
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
        >
          Create Machine
        </button>
      </div>
    </div>
  );
}
