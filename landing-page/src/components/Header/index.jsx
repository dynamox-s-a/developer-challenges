import logo from '../../assets/logo-dynamox.png';
import './styles.css';

export function Header() {
  function scrollToSection(hash) {
    const section = document.querySelector(hash).offsetTop;
    console.log(section)
    window.scroll({
      top: section - 120,
      behavior: "smooth"
    })
  }

  return(
    <header className="grid-pattern">
      <div className="contain-header">

        <a href="https://dynamox.net/">
          <img src={logo} alt="logo" className="logo" />
        </a>
        
        <nav className="menu">
          <ul>
            <a href="https://dynamox.net/dynapredict/">
              <li>DynaPredict</li>
            </a>
            <a href="#sensores" onClick={() => scrollToSection("#sensors")}>
              <li>Sensores</li>
            </a>
            <a href="#contato" onClick={() => scrollToSection("#contact")}>
              <li>Contato</li>
            </a>
          </ul>
        </nav>

      </div>
    </header>
  )
}