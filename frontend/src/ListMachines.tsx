import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { MachineType } from "./MachineCard"
import useAuth from "./useAuth"
import axios from "axios"

export default function ListMachines() {
  const [loading, setLoading] = useState(true)
  const [machines, setMachines] = useState<MachineType[]>([])
  const n = useNavigate()
  const auth = useAuth()
  const { id } = auth!.user

  const okFunc = (data: string) => {
    const m = JSON.parse(data)
    setMachines(m)
    setLoading(false)
    console.log(m)
  }

  useEffect(() => {
    if (machines.length === 0) {
      requestMachines(id, okFunc)
    }
  }, [])

  return (
    <div>
      {loading && <Loading />}
      {machines.map((m, k) => (
        <div key={k} onClick={() => n(`/sensors?id=${m.id}&type=${m.type}`)}>
          <p>{`Name: ${m.name}`}</p>
          <p>{`Type: ${m.type}`}</p>
        </div>
      ))}
    </div>
  )
}

export function Loading() {
  return <div>Loading...</div>
}

function requestMachines(
  id: string,
  okFunc = console.log,
  errFunc = console.log,
) {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:3001/machines/${id}`,
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
