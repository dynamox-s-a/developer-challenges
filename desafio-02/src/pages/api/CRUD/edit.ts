import FormatData from "@/interfaces/dataFormated";
import apiFake from "../fakeApi";

export const editProductApi = async (data: FormatData) => {
    const response = await apiFake.put(`products/${data.id}`, data);
}
