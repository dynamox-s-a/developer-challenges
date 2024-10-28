"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Machines() {
  const [machines, setMachines] = useState([]);
  const router = useRouter();

  // Função para fazer logout
  const handleLogout = () => {
    Cookies.remove("token"); // Remove o token dos cookies
    router.push("/"); // Redireciona para a página inicial
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      // Se não houver token, redireciona para a página inicial
      router.push("/");
      return;
    }

    const fetchMachines = async () => {
      const response = await fetch("/api/machines", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setMachines(data);
      } else {
        alert("Erro ao carregar as máquinas");
        router.push("/"); // Redireciona para a página inicial em caso de erro
      }
    };

    fetchMachines();
  }, [router]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Máquinas</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine: any) => (
          <div
            key={machine.id}
            className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">{machine.name}</h2>
            <p className="text-gray-500">Tipo: {machine.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
