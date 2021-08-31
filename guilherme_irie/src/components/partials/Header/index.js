import React from 'react';
import { HeaderArea } from './styled';
import logo from '../../../assets/logo-dynamox.png';


const Header = () => {
    return (
        <HeaderArea>
            <div className="container">
                <div className="logo">
                    <a href="https://dynamox.net/">
                        <img src={logo} alt={'logo'} />
                    </a>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href="https://dynamox.net/dynapredict/">DynaPredict</a>
                        </li>
                        <li>
                            <a href="#section1">Sensores</a>
                        </li>
                        <li>
                            <a href="#section2">Contato</a>
                        </li>
                    </ul>
                </nav>

            </div>
        </HeaderArea>
    );
}

export default Header;