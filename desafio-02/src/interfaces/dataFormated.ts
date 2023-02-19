interface FormatData  {
    name: string;
    fabricationDate:string | undefined,
    perecive: boolean,
    validate: string | undefined,
    price: number
    id?:number | string
  }

export default FormatData;