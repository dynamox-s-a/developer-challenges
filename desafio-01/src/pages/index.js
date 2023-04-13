import React from "react";
import {Header, FirstContainer, SecondContainer, LastContainer} from "../components/Home";

const Home = () => {
  return(
    <div className="home">
      <Header />
      <FirstContainer />
      <SecondContainer />
      <LastContainer />
    </div>
  )
}

export default Home;