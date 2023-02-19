import dayjs, { Dayjs } from 'dayjs';
interface DataCreate {
    name:string;
    fabricationDate:Dayjs | null;
    isPerecive: boolean;
    validate?: Dayjs | null;
    price: number;
    id?:''
}

export default DataCreate;