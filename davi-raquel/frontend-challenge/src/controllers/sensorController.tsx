import type { ApiResponseBySensor } from "../@types"

export const fetchDataBySensor = async (requestId: number) => {
  try {
    const response: ApiResponseBySensor[] = await fetch("db/mockDb.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(function (response) {
      return response.json()
    })
    const data = response.filter(item => item.id === requestId)
    return data[0]
  } catch (error) {
    console.error(error)
    return error
  }
}
