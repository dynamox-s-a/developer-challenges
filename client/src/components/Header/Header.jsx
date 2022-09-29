import logoDynamox from '../../assets/images/logo-dynamox.png'
import './Header.css'
import { NavBar } from '../NavBar/NavBar'

export function Header() {
  return (
    <section className='header'>
      <div className="logo">
        <a target="_blank" rel="noopener noreferrer" href='https://dynamox.net/'>
          <img src={logoDynamox} alt="logo Dynamox" />
        </a>
      </div>
      <NavBar />
    </section>
  );
};