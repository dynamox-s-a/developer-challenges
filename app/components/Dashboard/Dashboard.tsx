"use client";

import React, { useState, useEffect } from "react";
import { DashboardProps, ControlData } from "../../types/types";
import API_BASE_URL from "../../api/config";

const Dashboard: React.FC<DashboardProps> = () => {
  const [controls, setControls] = useState<ControlData[]>([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [fetchedControls, setFetchedControls] = useState<ControlData[]>([]);
  const [sortColumn, setSortColumn] = useState<number | null>(null);

  const handleSort = (column: number) => {
    console.log("handleSort called with column:", column);
    console.log("Current sortColumn:", sortColumn);
    console.log("Current sortOrder:", sortOrder);

    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }

    const sortedControls = [...fetchedControls];
    sortedControls.sort((a, b) => {
      switch (column) {
        case 0: // Nome da Máquina
          return sortOrder === "asc"
            ? a.machine_name.localeCompare(b.machine_name)
            : b.machine_name.localeCompare(a.machine_name);
        case 1: // Tipo de Máquina
          return sortOrder === "asc"
            ? a.machine_type_selected.localeCompare(b.machine_type_selected)
            : b.machine_type_selected.localeCompare(a.machine_type_selected);
        case 2: // Setor da Máquina
          return sortOrder === "asc"
            ? a.machine_sector.localeCompare(b.machine_sector)
            : b.machine_sector.localeCompare(a.machine_sector);
        case 3: // Nome do Primeiro Sensor
          return sortOrder === "asc"
            ? a.controls[0].sensor_name.localeCompare(b.controls[0].sensor_name)
            : b.controls[0].sensor_name.localeCompare(
                a.controls[0].sensor_name
              );
        case 4: // Tipo do Primeiro Sensor
          return sortOrder === "asc"
            ? a.controls[0].sensor_type.localeCompare(b.controls[0].sensor_type)
            : b.controls[0].sensor_type.localeCompare(
                a.controls[0].sensor_type
              );
        default:
          return 0;
      }
    });

    setControls(sortedControls);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/controls`)
      .then((response) => response.json())
      .then((data) => {
        setControls(data);
        setFetchedControls(data);
      })
      .catch((error) => console.error("Erro ao carregar os dados:", error));
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = controls.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(controls.length / itemsPerPage);

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
        <table className="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="bg-blue-300">
              <th
                scope="col"
                className="px-3 py-3 text-center"
                onClick={() => handleSort(0)}
              >
                Nome da Máquina
                {sortColumn === 0 && (
                  <span className="relative left-2 top-0 text-sm">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className=" px-3 py-3 text-center"
                onClick={() => handleSort(1)}
              >
                Tipo de Máquina
                {sortColumn === 1 && (
                  <span className="relative left-2 top-0 text-sm">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className=" px-3 py-3 text-center"
                onClick={() => handleSort(2)}
              >
                Setor da Máquina
                {sortColumn === 2 && (
                  <span className="relative left-2 top-0 text-sm">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className=" px-3 py-3 text-center"
                onClick={() => handleSort(3)}
              >
                Nome do Sensor
                {sortColumn === 3 && (
                  <span className="relative left-2 top-0 text-sm">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className=" px-3 py-3 text-center"
                onClick={() => handleSort(4)}
              >
                Tipo do Sensor
                {sortColumn === 4 && (
                  <span className="relative left-2 top-0 text-sm">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((control, index) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={index}
              >
                <td className="px-3 py-3 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {control.machine_name}
                </td>
                <td className="px-3 py-3 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {control.machine_type_selected}
                </td>
                <td className="px-3 py-3 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {control.machine_sector}
                </td>
                <td className="px-3 py-3 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {control.controls.map((sensor) => (
                    <div key={sensor.sensor_name}>{sensor.sensor_name}</div>
                  ))}
                </td>
                <td className="px-3 py-3 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
