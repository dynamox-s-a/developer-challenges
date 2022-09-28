import logoDynamox from '../../assets/images/logo-dynamox.png'
import './Header.css'

export function Header() {
  return (
    <section className='header'>
      <div className="logo">
        <a target="_blank" rel="noopener noreferrer" href='https://dynamox.net/'>
          <img src={logoDynamox} alt="logo Dynamox" />
        </a>
      </div>
      <div className="menu">
        <a target="_blank" rel="noopener noreferrer" href="https://dynamox.net/dynapredict/">
          <p>DynaPredict</p>
        </a>
        <a href="/#sensors">
          <p>Sensores</p>
        </a>
        <a href="/#contact">
          <p>Contato</p>
        </a>
      </div>

    </section>
  );
};