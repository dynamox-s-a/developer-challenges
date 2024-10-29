"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface MonitoringPoint {
  id: number;
  name: string;
  machineId: number;
}

export default function MonitoringPoints() {
  const [points, setPoints] = useState<MonitoringPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch("/api/monitoring-points", {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch points: ${response.statusText}`);
        }

        const data = await response.json();
        setPoints(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
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
        <h1 className="text-3xl font-bold mb-6">Monitoring Points</h1>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.id}>
                <td className="border px-4 py-2 text-center">{point.id}</td>
                <td className="border px-4 py-2 text-center">{point.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => router.push("/monitoring-points/create")}
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
        >
          Create Monitoring Point
        </button>
      </div>
    </div>
  );
}
