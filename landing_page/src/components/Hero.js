const Hero = () => {
    return (
        <div className="hero-container">
            <div className="hero-content">
                <div className="title">
                    <h1 style={{ marginBottom : "45px" }}>Solução<br/>DynaPredict</h1>
                    <img src={require("../assets/images/logo-dynapredict.png")} alt="DynaPredict Logo" style={{ alignSelf : "flex-start" }}></img>
                </div>
                <div className="demo">
                    <img src={require("../assets/images/desktop-and-mobile.png")} alt="DynaPredict Demo"></img>
                </div>
            </div>
        </div>
    )
}

export default Hero