function toggleMenu() {
    var menu = document.getElementsByClassName('mobile-navigation-links')[0];

    if (menu.style.display === "flex") {
        menu.style.display = "none";
    } else {
        menu.style.display = "flex";
    }
}

function closeMenu() {
    var menu = document.getElementsByClassName('mobile-navigation-links')[0];
    if (menu.style.display !== "none") {
        menu.style.display = "none";
    }
}

const Header = () => {
    return (
        <header id="navigation">
            <nav className="navigation-content">
                <div className="navigation-logo">
                    <a href="https://dynamox.net/" target="_blank" rel="noopener noreferrer">
                        <img src={require("../assets/images/logo-dynamox.png")} alt="Dynamox Logo" style={{ width : "150px" }}></img>
                    </a>
                </div>
                <div>
                    <button id="menu-btn" onClick={toggleMenu}>Menu</button>
                </div>
                <div className="mobile-navigation-links">
                    <a href="https://dynamox.net/dynapredict/" target="_blank" rel="noopener noreferrer">DynaPredict</a>
                    <a href="#sensores" onClick={closeMenu}>Sensores</a>
                    <a href="#contacto" onClick={closeMenu}>Contacto</a>
                </div>
                <div className="navigation-links">
                    <a href="https://dynamox.net/dynapredict/" target="_blank" rel="noopener noreferrer">DynaPredict</a>
                    <a href="#sensores">Sensores</a>
                    <a href="#contacto">Contacto</a>
                </div>
            </nav>
        </header>
    )
}

export default Header