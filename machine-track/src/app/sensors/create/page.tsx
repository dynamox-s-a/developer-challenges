"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const sensorModels = ["TcAg", "TcAs", "HFPlus"];
interface MonitoringPoint {
    id: number;
    name: string;
    machineId: number;
}

export default function CreateSensor() {
  const [uniqueId, setUniqueId] = useState("");
  const [modelName, setModelName] = useState(sensorModels[0]);
  const [monitoringPointId, setMonitoringPointId] = useState("");
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMonitoringPoints = async () => {
      try {
        const response = await fetch("/api/monitoring-points", {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        });
        const data = await response.json();
        setMonitoringPoints(data);
        if (data.length) setMonitoringPointId(data[0].id); 
      } catch (error) {
        console.error("Error fetching monitoring points:", error);
      }
    };
    fetchMonitoringPoints();
  }, []);

  const handleCreate = async () => {
    setError(null);

    if (uniqueId.length < 1) {
      setError("Name must be at least 1 characters long.");
      console.log(error);
      return;
    }

    if (!monitoringPointId) {
      setError("Please select a monitoring point.");
      console.log(error);
      return;
    }

    try {
      const response = await fetch("/api/sensors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ uniqueId, modelName, monitoringPointId: monitoringPointId.toString(), }),
      });

      if (response.ok) {
        router.push("/sensors");
      } else {
        const errorData = await response.json();
        console.log(errorData);
        alert(`Failed to create sensor:\n${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating sensor:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create Sensor</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <input
        type="text"
        placeholder="Name"
        value={uniqueId}
        onChange={(e) => setUniqueId(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />
      <select
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      >
        {sensorModels.map((model) => (
          <option key={model} value={model}>
            {model == "HFPlus" ? "HF+" : model}
          </option>
        ))}
      </select>
      <select
        value={monitoringPointId}
        onChange={(e) => setMonitoringPointId(e.target.value.toString())}
        className="border p-2 mb-4 w-full"
        required
      >
        {monitoringPoints.map((point) => (
          <option key={point.id} value={point.id}>
            {point.name}
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
          onClick={() => router.push("/sensors")}
          className="bg-gray-400 text-white py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
