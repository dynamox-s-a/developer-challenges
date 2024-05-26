import { ChangeStore } from "../../edu/change-store";
import { GetInfoStore } from "../../edu/get-info-store";

export function Edu(){
  return (
    <>
      <GetInfoStore />
      <ChangeStore />
    </>
  )
}