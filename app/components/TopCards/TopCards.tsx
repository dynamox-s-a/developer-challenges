"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import API_BASE_URL from "../../api/config";

const TopCards = () => {
  const [totalSensors, setTotalSensors] = useState(0);
  const [totalTcAs, setTotalTcAs] = useState(0);
  const [totalTcAg, setTotalTcAg] = useState(0);
  const [totalHFPlus, setTotalHFPlus] = useState(0);

  useEffect(() => {
    // Fazendo a solicitação para obter os dados de controls
    fetch(`${API_BASE_URL}/controls`)
      .then((response) => response.json())
      .then((data) => {
        // Iterando sobre os dados de controls para calcular as quantidades totais
        let totalSensorsCount = 0;
        let totalTcAsCount = 0;
        let totalTcAgCount = 0;
        let totalHFPlusCount = 0;

        data.forEach((control: any) => {
          control.controls.forEach((sensor: any) => {
            totalSensorsCount++;
            switch (sensor.sensor_type) {
              case "TcAs":
                totalTcAsCount++;
                break;
              case "TcAg":
                totalTcAgCount++;
                break;
              case "HF+":
                totalHFPlusCount++;
                break;
              default:
                break;
            }
          });
        });

        setTotalSensors(totalSensorsCount);
        setTotalTcAs(totalTcAsCount);
        setTotalTcAg(totalTcAgCount);
        setTotalHFPlus(totalHFPlusCount);
      })
      .catch((error) => console.error("Erro ao carregar os dados:", error));
  }, []);

  const percentualTcAs = ((totalTcAs / totalSensors) * 100)
    .toFixed(2)
    .replace(".", ",");
  const percentualTcAg = ((totalTcAg / totalSensors) * 100)
    .toFixed(2)
    .replace(".", ",");
  const percentualHFPlus = ((totalHFPlus / totalSensors) * 100)
    .toFixed(2)
    .replace(".", ",");

  return (
    <div className="ml-20 grid lg:grid-cols-12 grid-cols-12 gap-4 p-4">
      <div className="lg:col-span-4 md:col-span-4 sm:col-span-12 col-span-4 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full">
          <Image
            src="/assets/img/sensor_hf.png"
            alt="Sensor HF+"
            width={100}
            height={100}
            className="w-1/3 h-auto"
          />

          <p className="text-2xl font-bold">Sensor HF+</p>
          <p className="text-gray-600">
            Análise espectral e telemetria até 13.3kHz
          </p>
        </div>

        <div>
          <p className="text-base font-bold flex justify-center">Uso:</p>
          <p className="bg-blue-300 flex justify-center items-center p-2 rounded-lg">
            <span className="text-blue-800 text-lg">{percentualHFPlus}%</span>
          </p>
        </div>
      </div>
      <div className="lg:col-span-4 md:col-span-4 sm:col-span-12 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full">
          <Image
            src="/assets/img/sensor_tcag.png"
            alt="Sensor TcAg"
            width={100}
            height={100}
            className="w-1/3 h-auto"
          />
          <p className="text-2xl font-bold">Sensor TcAg</p>
          <p className="text-gray-600">
            Análise espectral e telemetria até 2.5kHz
          </p>
        </div>

        <div>
          <p className="text-base font-bold flex justify-center">Uso:</p>

          <p className="bg-blue-300 flex justify-center items-center p-2 rounded-lg">
            <span className="text-blue-800 text-lg">{percentualTcAs}%</span>
          </p>
        </div>
      </div>
      <div className="lg:col-span-4 md:col-span-4 sm:col-span-12 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full">
          <Image
            src="/assets/img/sensor_tcas.png"
            alt="Sensor TcAs"
            width={100}
            height={100}
            className="w-1/3 h-auto"
          />
          <p className="text-2xl font-bold">Sensor TcAs</p>
          <p className="text-gray-600">
            Alta resolução espectral e telemetria até 2.5kHz
          </p>
        </div>
        <div>
          <p className="text-base font-bold flex justify-center">Uso:</p>

          <p className="bg-blue-300 flex justify-center items-center p-2 rounded-lg">
            <span className="text-blue-800 text-lg">{percentualTcAg}%</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopCards;
