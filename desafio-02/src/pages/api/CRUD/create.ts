import FormatData from "@/interfaces/dataFormated"
import apiFake from "../fakeApi"

export const createNewProduct = async (formatData: FormatData) => {
    const response = await apiFake.post(`products`, formatData)
}
