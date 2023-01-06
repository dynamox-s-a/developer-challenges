import React from 'react';
import './header.css';
import desktopAndMobile from '../../assets-desafio-01/desktop-and-mobile.png';
import logoDynapredict from '../../assets-desafio-01/logo-dynapredict.png';
// import background from '../../assets-desafio-01/grafismo.png';


const Header = () => {
  return (
    <div className="header" id="home">
      {/* <div className="header-backgrond">
        <img src={background} alt="background" /> */}

        <div className="header-content">
          <h1 className="title-text">Solução DynaPredict</h1>
          <div className="header-content_logo">
            <img src={logoDynapredict} alt="logo-dynapredict" />
          </div>
        </div>

        <div className="header-image_desktop-and-mobile">
            <img src={desktopAndMobile} alt="desktop-and-mobile" />
        </div>

      {/* </div> */}
    </div>
  )
}

export default Header