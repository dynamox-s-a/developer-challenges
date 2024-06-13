import axios from "axios"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { MACHINE_TYPES, SENSOR_MAP, SENSOR_TYPES } from "./constants"
import "./Machines.css"

export default function CreateSensor() {
  const [search] = useSearchParams()
  const machineId = search.get("id")
  const machineType = search.get("type")

  const [data, setdata] = useState({
    name: "",
    type: SENSOR_TYPES[0],
  })

  const sensorOptions =
    SENSOR_MAP[MACHINE_TYPES.findIndex(i => i.toLowerCase() === machineType?.toLocaleLowerCase())] ||
    []

  const { name, type } = data
  const setName = (value: string) => setdata({ ...data, name: value })
  const setType = (value: string) => setdata({ ...data, type: value })

  const okFunc = (data: string) => {
    alert("New sensor created!")
    console.log(data)
  }

  const errFunc = (data: string) => {
    alert("Error! No new sensor created.")
    console.log(data)
  }

  const handleCreate = () => {
    if (machineId) {
      console.log("New Sensor: ", { machineId, name, type })
      const machine: newSensorParams = { machineId, name, type }
      requestNewSensor(machine, okFunc, errFunc)
    }
  }

  return (
    <div id="createMachine">
      <div>
        <h2>Create a new sensor</h2>
        {/* <p>{`machineId: ${machineId} --- machineType: ${machineType}`}</p> */}
      </div>
      <div>
        <label htmlFor="name">Sensor Name:</label>{" "}
        <input
          id="name"
          type="text"
          onChange={({ target: { value } }) => setName(value)}
        />
      </div>
      <div>
        <label htmlFor="name">Sensor Type:</label>{" "}
        <select onChange={({ target: { value } }) => setType(value)}>
          {sensorOptions.map((i, k) => (
            <option key={k} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>
      <div id="buttonBox">
        <button
          type="button"
          onClick={handleCreate}
          disabled={!machineId || !machineType}
        >
          Create
        </button>
        {/* <button type="button">Cancel</button> */}
      </div>
    </div>
  )
}

export type newSensorParams = { machineId: string; name: string; type: string }

function requestNewSensor(
  sensor: newSensorParams,
  okFunc = console.log,
  errFunc = console.log,
) {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:3001/sensors",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(sensor),
  }

  axios
    .request(config)
    .then(response => {
      okFunc(JSON.stringify(response.data))
    })
    .catch(error => {
      errFunc(error)
    })
}
