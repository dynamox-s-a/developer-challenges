import { Outlet } from "react-router-dom";
import { Header } from "../_components/header/header";

export function AppLayout(){
  return(
    <>
      <Header />
      <Outlet />
    </>
  )
}