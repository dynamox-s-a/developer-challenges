import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Machine } from "../types/machine";

const MachineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const response = await api.get<Machine>(`/machines/${id}`);
        setMachine(response.data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os detalhes da máquina.");
      } finally {
        setLoading(false);
      }
    };

    fetchMachine();
  }, [id]);

  if (loading) return <p className="text-gray-600 text-center mt-10">Carregando detalhes...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!machine) return <p className="text-gray-600 text-center mt-10">Máquina não encontrada.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Detalhes da Máquina</h2>

      <div className="space-y-4">
        <div className="flex justify-between border-b pb-1">
          <span className="font-medium text-gray-700">Nome:</span>
          <span className="text-gray-900">{machine.name}</span>
        </div>
        <div className="flex justify-between border-b pb-1">
          <span className="font-medium text-gray-700">Número de Série:</span>
          <span className="text-gray-900">{machine.serialNumber}</span>
        </div>
        <div className="flex justify-between border-b pb-1">
          <span className="font-medium text-gray-700">Tipo:</span>
          <span className="text-gray-900">{machine.machineType?.name || machine.machineTypeId}</span>
        </div>
        <div className="flex justify-between border-b pb-1">
          <span className="font-medium text-gray-700">Descrição:</span>
          <span className="text-gray-900">{machine.description || "—"}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/machines")}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
      >
        Voltar à lista
      </button>
    </div>
  );
};

export default MachineDetails;
