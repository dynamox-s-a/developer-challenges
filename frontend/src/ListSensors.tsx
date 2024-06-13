import axios from "axios"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Loading } from "./ListMachines"

export type SensorType = {
  id: string
  name: string
  type: string
  machineId: string
}

export default function ListSensors() {
  const [search] = useSearchParams()
  const [sensors, setSensors] = useState<SensorType[]>([])
  const [loading, setLoading] = useState(true)

  const id = search.get("id")

  const okFunc = (data: string) => {
    const m = JSON.parse(data)
    setSensors(m)
    setLoading(false)
    console.log(m)
  }

  useEffect(() => {
    if (id) {
      requestSensors(id, okFunc)
    }
  }, [id])

  return (
    <div>
      {loading && <Loading />}
      {sensors.map((s, k) => (
        <div key={k}>
          <p>{`Name: ${s.name}`}</p>
          <p>{`Type: ${s.type}`}</p>
        </div>
      ))}
    </div>
  )
}

function requestSensors(
  id: string,
  okFunc = console.log,
  errFunc = console.log,
) {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:3001/sensors/${id}`,
    headers: {},
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
