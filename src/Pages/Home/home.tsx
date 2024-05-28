import { Helmet } from "react-helmet-async";
import { Footer } from "../../_components/sections/footer";
import { TitlePage } from "../../_components/ui/title-page";

export function Home(){
  return (
    <>
      <Helmet title="Home"/>
      <TitlePage>HomeScreen</TitlePage>
      <Footer/>
    </>
  )
}