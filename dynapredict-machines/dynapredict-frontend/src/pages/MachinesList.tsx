import React, { useEffect, useState } from "react";
import api from "../services/api";
import type { Machine } from "../types/machine";
import { Link } from "react-router-dom";

const MachinesList: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await api.get<Machine[]>("/machines");
        setMachines(response.data);
      } catch (err: any) {
        console.error("Erro ao buscar /machines:", err);
        if (err.response) {
          setError(
            `Erro ${err.response.status}: ${JSON.stringify(err.response.data)}`
          );
        } else if (err.request) {
          setError(
            "Sem resposta do servidor. Verifique se a API está rodando em http://localhost:5023 e se o CORS está liberado."
          );
        } else {
          setError(`Erro: ${err.message ?? "desconhecido"}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  if (loading) return <p className="text-gray-600 text-center mt-10">Carregando máquinas...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Lista de Máquinas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Nome</th>
              <th className="px-4 py-2 text-left text-gray-700">Número de Série</th>
              <th className="px-4 py-2 text-left text-gray-700">Tipo</th>
              <th className="px-4 py-2 text-left text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((machine) => (
              <tr
                key={machine.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-gray-900">{machine.name}</td>
                <td className="px-4 py-2 text-gray-900">{machine.serialNumber}</td>
                <td className="px-4 py-2 text-gray-900">
                  {machine.machineType?.name ?? machine.machineTypeId}
                </td>
                <td className="px-4 py-2">
                  <Link
                    to={`/machines/${machine.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Detalhes
                  </Link>
                </td>
              </tr>
            ))}
            {machines.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  Nenhuma máquina cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MachinesList;
