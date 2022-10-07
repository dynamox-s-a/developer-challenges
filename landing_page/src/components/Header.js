const Header = () => {
    return (
        <header id="navigation">
            <nav className="navigation-content">
                <div className="navigation-logo">
                    <a href="https://dynamox.net/" target="_blank" rel="noopener noreferrer">
                        <img src={require("../assets/images/logo-dynamox.png")} alt="Dynamox Logo" style={{ width : "150px" }}></img>
                    </a>
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