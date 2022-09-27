import logoDynamox from '../../assets/images/logo-dynamox.png'
import './Header.css'

export function Header() {
  return (
    <section className='header'>
      <div className="logo">
        <a href='https://dynamox.net/'>
          <img src={logoDynamox} alt="logo Dynamox" />
        </a>
      </div>
      <div className="menu">
        <a target="_blank" href="https://dynamox.net/dynapredict/">
          <p>DynaPredict</p>
        </a>
        <a target="_blank" href="https://vanderleimiguel.herokuapp.com/">
          <p>Sensores</p>
        </a>
        <a target="_blank" href="https://vanderleimiguel.herokuapp.com/">
          <p>Contato</p>
        </a>
      </div>

    </section>
  );
};