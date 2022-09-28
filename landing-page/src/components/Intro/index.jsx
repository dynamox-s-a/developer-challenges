import logoDynapredict from '../../assets/logo-dynapredict.png';
import desktopMobile from '../../assets/desktop-and-mobile.png';
import './styles.css';

export function Intro() {
  return(
    <section className="grid-pattern intro">
      <div className="intro-section">

        <div className="intro-content">
          <h1 className="title">Solução DynaPredict</h1>
          <img src={logoDynapredict} alt="logo da DynaPredict" />
        </div>

        <div className="intro-image">
          <img src={desktopMobile} alt="Imagem inical da plataforma DynaPredict em desktop e mobile" />
        </div>

      </div>
    </section>
  )
}