import DataCreate from "@/interfaces/dataCreate";
import FormatData from "@/interfaces/dataFormated";

export const formatDataFunction = (values:DataCreate, id?: any):FormatData => {
    const formatData = {
      name: values.name,
      fabricationDate:values.fabricationDate?.format('DD/MM/YYYY'),
      perecive: values.isPerecive,
      validate: values.validate?.format('DD/MM/YYYY'),
      price: values.price,
      id: id
    }
    return formatData
}