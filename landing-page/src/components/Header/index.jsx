import logo from '../../assets/logo-dynamox.png';
import './styles.css';

export function Header() {
  return(
    <header className="grid-pattern">
      <div className="contain-header">

        <a href="https://dynamox.net/">
          <img src={logo} alt="logo" className="logo" />
        </a>
        
        <div className="navbar">
          <nav>
            <ul>
              <a href="https://dynamox.net/dynapredict/">
                <li>DynaPredict</li>
              </a>
              <a href="#">
                <li>Sensores</li>
              </a>
              <a href="#">
                <li>Contato</li>
              </a>
            </ul>
          </nav>
        </div>

      </div>
    </header>
  )
}