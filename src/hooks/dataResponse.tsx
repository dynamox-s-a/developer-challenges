import { Measure } from "../@types/types";
import { useAppSelector } from "../store";

export function DataResponse(){
  const measures: Measure[] = useAppSelector(store => store.measures.data);
  
  return { measures }
}