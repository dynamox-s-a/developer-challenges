const Sensores = () => {
    return (
        <div className="sensores-container">
            <div className="sensores-content">
                <div className="sensores-title">
                    <h2>Sensores para Manutenção Preditiva</h2>
                    <p>Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway, registrando os dados monitorados em sua memória interna. Por conexão internet esses dados são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.</p>
                    <a href="https://dynamox.net/dynapredict/" target="_blank" rel="noopener noreferrer">Ver Mais</a>
                </div>
                <div className="sensores-products">
                    <div className="sensores-card">
                        <img src={require("../assets/images/sensor-tca.png")} alt="Sensor TcA+"></img>
                        <h3>TcA+</h3>
                    </div>
                    <div className="sensores-card">
                        <img src={require("../assets/images/sensor-af.png")} alt="Sensor AS"></img>
                        <h3>AS</h3>
                    </div>
                    <div className="sensores-card">
                        <img src={require("../assets/images/sensor-hf.png")} alt="Sensor HF"></img>
                        <h3>HF</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sensores