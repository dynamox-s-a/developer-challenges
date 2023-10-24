"use client";

import React, { useState, useEffect } from "react";
import { DashboardProps, ControlData } from "../../types/types";
import API_BASE_URL from "../../api/config";

const Dashboard: React.FC<DashboardProps> = () => {
  const [controls, setControls] = useState<ControlData[]>([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortedColumn, setSortedColumn] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [fetchedControls, setFetchedControls] = useState([]);

  const handleSort = (column: number, dataType: string) => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(column);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/controls`)
      .then((response) => response.json())
      .then((data) => {
        setControls(data);
        setFetchedControls(data);
        console.log("Dados carregados:", data);
      })
      .catch((error) => console.error("Erro ao carregar os dados:", error));
  }, []);

  const sortedControls = controls
    .filter((control) => control.controls && control.controls[0])
    .sort((a, b) => {
      if (sortedColumn === null) return 0;

      const columnKey =
        `monitoring_point_${sortedColumn}` as keyof (typeof a.controls)[0];
      const monitoringPointA = a.controls[0][columnKey];
      const monitoringPointB = b.controls[0][columnKey];

      if (monitoringPointA !== null && monitoringPointB !== null) {
        if (monitoringPointA < monitoringPointB) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (monitoringPointA > monitoringPointB) {
          return sortOrder === "asc" ? 1 : -1;
        }
      }
      return 0;
    });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = sortedControls.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(sortedControls.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="ml-20 p-4 ">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 gap-4 relative overflow-x-auto sm:rounded-lg">
        
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="bg-blue-300">
              <th
                onClick={() => handleSort(0, "string")}
                scope="col"
                className={`cursor-pointer px-6 py-3 ${
                  sortedColumn === 0 ? `sorted-${sortOrder}` : ""
                }`}
              >
                Nome da Máquina
              </th>
              <th
                onClick={() => handleSort(1, "string")}
                scope="col"
                className={`cursor-pointer px-6 py-3 ${
                  sortedColumn === 1 ? `sorted-${sortOrder}` : ""
                }`}
              >
                Tipo de Máquina
              </th>
              <th
                onClick={() => handleSort(2, "string")}
                scope="col"
                className={`cursor-pointer px-6 py-3 ${
                  sortedColumn === 2 ? `sorted-${sortOrder}` : ""
                }`}
              >
                Setor da Máquina
              </th>
              <th
                onClick={() => handleSort(3, "string")}
                scope="col"
                className={`cursor-pointer px-6 py-3 ${
                  sortedColumn === 3 ? `sorted-${sortOrder}` : ""
                }`}
              >
                Nome do Sensor
              </th>
              <th
                onClick={() => handleSort(4, "string")}
                scope="col"
                className={`cursor-pointer px-6 py-3 ${
                  sortedColumn === 4 ? `sorted-${sortOrder}` : ""
                }`}
              >
                Tipo do Sensor
              </th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((control, index) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={index}
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {control.machine_name}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {control.machine_type_selected}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {control.machine_sector}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {control.controls.map((sensor) => (
                    <div key={sensor.sensor_name}>{sensor.sensor_name}</div>
                  ))}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {control.controls.map((sensor) => (
                    <div key={sensor.sensor_name}>{sensor.sensor_type}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        <nav
          className="flex items-center justify-center pt-4 w-full"
          aria-label="Table navigation"
        >
          <ul className="flex -space-x-px text-sm h-8">
            <li>
              <a
                href="#"
                onClick={handlePrevPage}
                className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Anterior
              </a>
            </li>
            {Array.from({ length: totalPages }).map((_, i) => (
              <li key={i}>
                <a
                  href="#"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === i + 1 ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  {i + 1}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#"
                onClick={handleNextPage}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Próximo
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
