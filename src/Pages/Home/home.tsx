import { Helmet } from "react-helmet-async";
import { Footer } from "../../_components/sections/footer";

export function Home(){
  return (
    <>
      <Helmet title="Home"/>
      <Footer/>
    </>
  )
}