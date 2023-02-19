import apiFake from "../fakeApi"

export const deleteDataApi = async (id: string) => {
    const response = await apiFake.delete(`products/${id}`)
}