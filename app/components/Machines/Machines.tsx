import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addMachine,
  deleteMachine,
  setMachines,
} from "../../../lib/redux/actions/machinesActions";

import {
  addMachineType,
  deleteMachineType,
  setMachineTypes,
} from "../../../lib/redux/actions/machineTypesActions";

import { AppState } from "../../types/types";
import { updateMachine } from "../../../lib/redux/slices/machinesSlice";
import API_BASE_URL from "../../api/config";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddchart, MdDomainAdd } from "react-icons/md";
import { TbDatabasePlus, TbDatabaseEdit } from "react-icons/tb";





const Machines = () => {
  const machineTypes = useSelector((state: AppState) => state.machineTypes);
  const machines = useSelector((state: AppState) => state.machines);
  const dispatch = useDispatch();

  const [machineTypeSelected, setMachineTypeSelected] = useState("");
  const [newMachineType, setNewMachineType] = useState("");
  const [selectedMachineType, setSelectedMachineType] = useState("");

  const [newMachineNameInput, setNewMachineNameInput] = useState("");

  const [newMachineName, setNewMachineName] = useState("");
  const [newMachineSector, setNewMachineSector] = useState("");

  const [selectedMachine, setSelectedMachine] = useState("");
  const [selectedMachineId, setSelectedMachineId] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedMachineTypeSelected, setSelectedMachineTypeSelected] =
    useState("");

  const handleAddMachineTypes = async (e: any) => {
    e.preventDefault();

    const maxId = Array.isArray(machineTypes)
      ? machineTypes.reduce((max, type) => (type.id > max ? type.id : max), 0)
      : 0;

    const newType = {
      id: maxId + 1,
      machine_type: newMachineType,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/machine_types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newType),
      });

      if (response.ok) {
        dispatch(addMachineType(newType));
        setSelectedMachineType(newType.id.toString());
        setNewMachineType("");
        console.log("Novo tipo de máquina foi salvo com sucesso no DB.");
        fetchMachineTypes();
      } else {
        console.error("Erro ao salvar o novo tipo de máquina no DB.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  const handleDeleteMachineTypes = async (e: any) => {
    e.preventDefault();

    if (selectedMachineType === "") {
      console.error("Selecione um tipo de máquina para excluir.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/machine_types/${selectedMachineType}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        dispatch(deleteMachineType(selectedMachineType));
        setSelectedMachineType("");
        fetchMachineTypes();
        console.log("Tipo de máquina excluído com sucesso.");
      } else {
        console.error("Erro ao excluir o tipo de máquina.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  const fetchMachineTypes = () => {
    fetch(`${API_BASE_URL}/machine_types`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setMachineTypes(data));
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de tipos de máquina:", error);
      });
  };

  const handleAddMachine = async (e: any) => {
    e.preventDefault();

    const maxId = Array.isArray(machines)
      ? machines.reduce(
          (max, machine) => (machine.id > max ? machine.id : max),
          0
        )
      : 0;

    const newMachine = {
      id: maxId + 1,
      name: newMachineNameInput,
      sector: newMachineSector,
      machine_type_selected: machineTypeSelected,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/machine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMachine),
      });
      if (response.ok) {
        dispatch(addMachine(newMachine));
        setSelectedMachine(newMachine.id.toString());
        setNewMachineNameInput("");
        setNewMachineSector("");
        setMachineTypeSelected("");
        console.log("Nova máquina foi adicionada com sucesso no DB.");
        fetchMachine();
      } else {
        console.error("Erro ao adicionar a nova máquina no DB.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  const handleDeleteMachine = async (e: any) => {
    e.preventDefault();

    if (!selectedMachineId) {
      console.error("Selecione uma máquina para excluir.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/machine/${selectedMachineId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        dispatch(deleteMachine(selectedMachineId));
        console.log("Máquina excluída com sucesso.");
        fetchMachine();
        setSelectedMachineId("");
        setSelectedSector("");
        setSelectedMachineTypeSelected("");
      } else {
        console.error("Erro ao excluir a máquina.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  const fetchMachine = async () => {
    fetch(`${API_BASE_URL}/machine`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setMachines(data));
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de máquina:", error);
      });
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

  const handleEditMachine = async (e: any) => {
    e.preventDefault();

    if (!selectedMachineId) {
      console.error("Selecione uma máquina para editar.");
      return;
    }

    const editedMachine = {
      id: selectedMachineId,
      name: newMachineName,
      sector: selectedSector,
      machine_type_selected: selectedMachineTypeSelected,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/machine/${selectedMachineId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedMachine),
        }
      );

      if (response.ok) {
        dispatch(updateMachine(editedMachine));
        console.log("Máquina editada com sucesso.");
        fetchMachine();
        setSelectedMachineId("");
        setSelectedSector("");
        setSelectedMachineTypeSelected("");
      } else {
        console.error("Erro ao editar a máquina.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  const handleMachineTypeSelectChange = (e: any) => {
    setSelectedMachineTypeSelected(e.target.value);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/machine_types`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setMachineTypes(data));
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de tipos de máquina:", error);
      });

    fetch(`${API_BASE_URL}/machine`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setMachines(data));
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de máquinas:", error);
      });
  }, []);

  return (
    <div className="ml-20 p-4">
      <h2 className="text-xl font-semibold mb-4">Maquinário</h2>

      <div className="grid grid-cols-1 gap-4">
        <h4 className="pt-4 text-lg">Adicionar Tipos de Máquina</h4>

        <div className="pb-4 border-b grid grid-cols-1 gap-4 md:grid-cols-2">
          <form
            onSubmit={handleAddMachineTypes}
            className="grid grid-cols-4 gap-2 col-span-1"
          >
            <div className=" relative col-span-3">
              <input
                type="text"
                id="newMachineType"
                name="newMachineType"
                value={newMachineType}
                onChange={(e) => setNewMachineType(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
              <label
                htmlFor="newMachineType"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Tipo de máquina a adicionar
              </label>
            </div>

            <button
              type="submit"
              className="border border-blue-500 flex justify-center items-center text-white px-4 py-2 rounded-lg col-span-1"
            >
              
              <MdOutlineAddchart color="blue" size={25} />
              
            </button>
          </form>

          <form
            onSubmit={handleDeleteMachineTypes}
            className="grid grid-cols-4 gap-2 col-span-1"
          >
            <div className=" relative col-span-3">
              <select
                id="selectMachineType"
                name="selectMachineType"
                value={selectedMachineType}
                onChange={(e) => setSelectedMachineType(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              >
                <option value="" className="text-gray-500">
                  Selecione um tipo
                </option>
                {Array.isArray(machineTypes) &&
                  machineTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.machine_type}
                    </option>
                  ))}
              </select>
              <label
                htmlFor="selectMachineType"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Selecione tipo de máquina para excluir
              </label>
            </div>

            <button
              type="submit"
              className="border border-red-500 flex justify-center items-center text-white px-4 py-2 rounded-lg col-span-1"
            >
              <RiDeleteBin6Line color="red" size={25} />
            </button>
          </form>
        </div>
      </div>

      <div className="pb-4 border-b grid grid-cols-1 gap-4 ">
        <h4 className="pt-4 text-lg">Adicionar Máquina</h4>

        <div className="grid grid-cols-1 gap-4 ">
          <form onSubmit={handleAddMachine} className="grid grid-cols-4 gap-2">
            <div className=" relative col-span-1 max-lg:col-span-1   max-md:col-span-4">
              <input
                type="text"
                id="machineName"
                name="machineName"
                value={newMachineNameInput}
                onChange={(e) => setNewMachineNameInput(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
              <label
                htmlFor="machineName"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Nome da máquina a adicionar
              </label>
            </div>

            <div className=" relative col-span-1 max-lg:col-span-1 max-md:col-span-4">
              <input
                type="text"
                id="machineSectorAdd"
                name="machineSectorAdd"
                value={newMachineSector}
                onChange={(e) => setNewMachineSector(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
              <label
                htmlFor="machineSectorAdd"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Setor da máquina
              </label>
            </div>

            <div className=" relative col-span-1 max-lg:col-span-1  max-md:col-span-4">
              <select
                id="machineTypeSelected"
                name="machineTypeSelected"
                value={machineTypeSelected}
                onChange={(e) => setMachineTypeSelected(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              >
                <option value="" className="text-gray-500">
                  Seleiona o tipo de máquina
                </option>
                {Array.isArray(machineTypes) &&
                  machineTypes.map((type) => (
                    <option key={type.id} value={type.machine_type}>
                      {type.machine_type}
                    </option>
                  ))}
              </select>
              <label
                htmlFor="machineTypeSelected"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Tipo de máquina
              </label>
            </div>

            <button
              type="submit"
              className="border border-blue-500 flex justify-center items-center  text-white px-4 py-2 rounded-lg col-span-1 max-lg:col-span-1 max-md:col-span-4"
            >
             <TbDatabasePlus color="blue" size={25}/>
            
            </button>
          </form>
        </div>
      </div>

      <div className="pb-4 border-b grid grid-cols-1 gap-4">
        <h4 className="pt-4 text-lg">Editar Máquina</h4>

        <div className="grid grid-cols-1 gap-4">
          <form className="grid grid-cols-8 gap-2">
            <div className="relative  col-span-2 max-lg:col-span-2 max-md:col-span-8">
              <select
                id="selectMachineEdit"
                name="selectMachineEdit"
                value={selectedMachineId}
                onChange={(e) => {
                  handleSelectChange(e);
                  if (e.target.value === "") {
                    setSelectedSector(""); 
                    setSelectedMachineTypeSelected("");
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
                Máquina a editar
              </label>
            </div>

            <div className=" relative  col-span-2 max-lg:col-span-2 max-md:col-span-8">
              <input
                type="text"
                id="machineSectorEdit"
                name="machineSectorEdit"
                value={selectedSector !== "" ? selectedSector : selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
              <label
                htmlFor="machineSectorEdit"
                className="absolute text-sm text-gray-500 dark:text-gray-400 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 left-1 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                Setor da máquina a editar
              </label>
            </div>

            <div className="relative  col-span-2 max-lg:col-span-2 max-md:col-span-8">
              <select
                id="machineTypeSelectedEdit"
                name="machineTypeSelectedEdit"
                value={selectedMachineTypeSelected}
                onChange={handleMachineTypeSelectChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              >
                <option value="" className="text-gray-500">
                  Selecione
                </option>
                {Array.isArray(machineTypes) &&
                  machineTypes.map((type) => (
                    <option key={type.id} value={type.machine_type}>
                      {type.machine_type}
                    </option>
                  ))}
              </select>
              <label
                htmlFor="machineTypeSelectedEdit"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Tipo de máquina a editar
              </label>
            </div>
            
            <button
              onClick={handleEditMachine}
              className="border border-green-500 flex justify-center items-center text-white px-4 col-span-1 max-lg:col-span-1 max-md:col-span-8 py-2 rounded-lg "
            >
                            <TbDatabaseEdit color="green" size={25}/>
            </button>

            <button
              onClick={handleDeleteMachine}
              className="border border-red-500 flex justify-center items-center text-white px-4 col-span-1 max-lg:col-span-1 max-md:col-span-8 py-2 rounded-lg "
            >
               <RiDeleteBin6Line color="red" size={25} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Machines;
