import React, { useEffect, useState } from "react";
import api from "../services/api";
import type { MachineType } from "../types/machine";
import { useNavigate } from "react-router-dom";

export default function CreateMachine() {
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");
  const [machineTypeId, setMachineTypeId] = useState<number>(0);
  const [types, setTypes] = useState<MachineType[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<MachineType[]>("/machinetypes")
      .then(res => {
        if (res.data && res.data.length > 0) {
          setTypes(res.data);
        } else {
          setTypes([
            { id: 1, name: "Press" },
            { id: 2, name: "Lathe" },
            { id: 3, name: "Milling Machine" }
          ]);
        }
      })
      .catch(() => {
        setTypes([
          { id: 1, name: "Press" },
          { id: 2, name: "Lathe" },
          { id: 3, name: "Milling Machine" }
        ]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !serialNumber || !machineTypeId) {
      alert("Preencha nome, número de série e selecione um tipo.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/machines", {
        name,
        serialNumber,
        description,
        machineTypeId
      });
      navigate("/machines");
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert(err.response.data?.message ?? "Número de série já cadastrado");
      } else {
        alert(err.response?.data ?? "Erro ao criar máquina");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cadastrar Máquina</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Nome*</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Número de Série*</label>
          <input
            value={serialNumber}
            onChange={e => setSerialNumber(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Tipo*</label>
          <select
            value={machineTypeId}
            onChange={e => setMachineTypeId(Number(e.target.value))}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>-- selecione --</option>
            {types.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Descrição</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
