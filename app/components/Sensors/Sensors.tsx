import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState, SensorsType } from "../../types/types";
import API_BASE_URL from "../../api/config";
import { consultMachines } from "../../../lib/redux/actions/machinesActions";

const Sensors = () => {
  const machines = useSelector((state: AppState) => state.machines);
  const sensors = useSelector((state: AppState) => state.sensors);
  const dispatch = useDispatch();

  const [newMachineName, setNewMachineName] = useState("");
  const [selectedMachineId, setSelectedMachineId] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedMachineTypeSelected, setSelectedMachineTypeSelected] =
    useState("");

  const [sensorOptions, setSensorOptions] = useState<SensorsType[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<string[]>([]);
  const [newSensorName, setNewSensorName] = useState<string[]>([]);
  const [sensorGroup, setSensorGroup] = useState(2);

  const addSensorGroup = (e: any) => {
    e.preventDefault();
    setSensorGroup((prevSensorGroup) => prevSensorGroup + 1);
  };

  const removeSensorGroup = (e: any, index: number) => {
    e.preventDefault();
    setSensorGroup((prevSensorGroup) => {
      const novoSensorGroup = prevSensorGroup > 1 ? prevSensorGroup - 1 : 1;
      return novoSensorGroup;
    });
  };

  const handleSelectSensor = (e: any, index: number) => {
    e.preventDefault();
    const selectedValue = e.target.value;
    if (selectedMachineTypeSelected.toLowerCase() === "bomba") {
      const hfPlusOption = sensorOptions.find(
        (sensor) => sensor.sensor_type.toLowerCase() === "hf+"
      );
      if (hfPlusOption && selectedValue !== String(hfPlusOption.id)) {
        alert("Para máquinas do tipo 'bomba', selecione apenas 'HF+'.");
        return;
      }
    }
    if (index === -5 || index === -6) {
      setSelectedSensor(e.target.value);
    } else {
      setSelectedSensor((prevSelectedSensor) => {
        const updatedSensor = [...prevSelectedSensor];
        updatedSensor[index] = e.target.value;
        return updatedSensor;
      });
    }
  };

  const handleSensorNameChange = (e: any, index: number) => {
    e.preventDefault();
    const updatedSensorName = [...newSensorName];
    updatedSensorName[index] = e.target.value;
    setNewSensorName(updatedSensorName);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    setSelectedMachineId(selectedValue);
    const selectedMachine = machines.find(
      (machine) => machine.id === parseInt(selectedValue)
    );
    if (selectedMachine) {
      setNewMachineName(selectedMachine.name);
      setSelectedSector(selectedMachine.sector);
      setSelectedMachineTypeSelected(selectedMachine.machine_type_selected);
    }
  };

  const handleMachineTypeSelectChange = (e: any) => {
    setSelectedMachineTypeSelected(e.target.value);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/sensors`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados do sensor:", data.sensors);
        setSensorOptions(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de sensores:", error);
      });
    dispatch(consultMachines());
  }, [dispatch]);

  return (
    <div className="ml-20 p-4">
      <h2 className="text-xl font-semibold mb-4">Sensores</h2>

      <div className="pb-4 border-b grid grid-cols-1 gap-4">
        <h4 className="pt-4 text-lg">Vincular Sensores</h4>

        <div className="grid grid-cols-1 gap-4">
          <form className="grid grid-cols-12 gap-4">
            <div className="grid grid-cols-12 col-span-12 gap-4">
              <div className="relative col-span-4">
                <select
                  id="selectMachineEdit"
                  name="selectMachineEdit"
                  value={selectedMachineId}
                  onChange={(e) => {
                    handleSelectChange(e);
                    if (e.target.value === "") {
                      setSelectedSector("");
                      setSelectedMachineTypeSelected("");
                      setSelectedSensor([]);
                      setNewSensorName([])

                    }
                  }}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                >
                  <option value="" className="text-gray-500">
                    Selecione
                  </option>
                  {Array.isArray(machines) &&
                    machines.map((machine) => (
                      <option key={machine.id} value={machine.id}>
                        {machine.name}
                      </option>
                    ))}
                </select>
                <label
                  htmlFor="selectMachineEdit"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Máquina
                </label>
              </div>

              <div className=" relative col-span-4 ">
                <input
                  type="text"
                  id="machineSector"
                  name="machineSector"
                  readOnly={true}
                  value={
                    selectedSector !== "" ? selectedSector : selectedSector
                  }
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=""
                />
                <label
                  htmlFor="machineSector"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 left-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
                >
                  Setor da máquina
                </label>
              </div>

              <div className=" relative col-span-4 ">
                <input
                  type="text"
                  id="machineTypeSelectedEdit"
                  name="machineTypeSelectedEdit"
                  readOnly={true}
                  value={selectedMachineTypeSelected}
                  onChange={handleMachineTypeSelectChange}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=""
                />
                <label
                  htmlFor="machineTypeSelectedEdit"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 left-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
                >
                  Tipo da máquina
                </label>
              </div>
            </div>

            <div className="grid grid-cols-12 col-span-12 gap-4">
              {Array.from({ length: sensorGroup }).map((_, index) => (
                <div key={index} className="grid col-span-6 gap-4 ">
                  <div className="grid grid-cols-6 gap-4 ">
                    <div className="relative col-span-2">
                      <select
                        id={`sensorTypeSelect${index}`}
                        name={`sensorTypeSelect${index}`}
                        value={selectedSensor[index] || ""}
                        onChange={(e) => handleSelectSensor(e, index)}
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      >
                        <option value="">Selecione o sensor</option>
                        {Array.isArray(sensorOptions) &&
                          sensorOptions.map((sensor: SensorsType) => (
                            <option key={sensor.id} value={sensor.id}>
                              {sensor.sensor_type}
                            </option>
                          ))}
                      </select>
                      <label
                        htmlFor={`sensorTypeSelect${index}`}
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                      >
                        Tipo de sensor
                      </label>
                    </div>

                    <div
                      className={`relative col-span-${index < 2 ? "4" : "3"}`}
                    >
                      <input
                        type="text"
                        id={`sensorName${index}`}
                        name={`sensorName${index}`}
                        value={newSensorName[index] || ""}
                onChange={(e) => handleSensorNameChange(e, index)}
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                      />
                      <label
                        htmlFor={`sensorName${index}`}
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                      >
                        Nome do sensor
                      </label>
                    </div>

                    {index >= 2 ? (
                      <button
                        onClick={(e) => removeSensorGroup(e, index)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg col-span-1 "
                      >
                        Excluir
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addSensorGroup}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg col-span-12 mt-4"
            >
              Adicionar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sensors;
