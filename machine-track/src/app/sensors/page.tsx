"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface Sensor {
  id: number;
  uniqueId: string;
  modelName: string;
}

export default function Sensors() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await fetch("/api/sensors", {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch sensors: ${response.statusText}`);
        }

        const data = await response.json();
        setSensors(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) {
    alert(`Error: ${error}`);
    router.push("/");
  }

  return (
    <div>
      <NavBar />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Sensors</h1>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Model</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor) => (
              <tr key={sensor.id}>
                <td className="border px-4 py-2 text-center">{sensor.id}</td>
                <td className="border px-4 py-2 text-center">{sensor.uniqueId}</td>
                <td className="border px-4 py-2 text-center">{sensor.modelName == "HFPlus" ? "HF+" : sensor.modelName}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => router.push("/sensors/create")}
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
        >
          Create Sensor
        </button>
      </div>
    </div>
  );
}
