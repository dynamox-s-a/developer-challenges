import Header from "../../components/Header"
import computador from "../../assets/desktop-and-mobile.png"
import sensor_af from "../../assets/sensor-af.png"
import sensor_hf from "../../assets/sensor-hf.png"
import sensor_tca from "../../assets/sensor-tca.png"
import logo from "../../assets/logo-dynapredict.png"
import { Grafismo, Container, Sensores, Down } from "./styles";
import Button from "../../components/Button";
import Footer from "../../components/Footer"
const Dashboard = () => {



    return(
        <Container>
            <Header/>
            <Grafismo>
                <div className="left">
                    <h1>Solução DynaPredict</h1>
                    <img src={logo} alt="logo"/>
                </div>
                <img src={computador} alt="computador"/>
            </Grafismo>
            <Sensores>
                <div classname="top">
                    <h1>Sensores para Manutenção Preditiva</h1>
                    <h2>Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e
                        temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway,
                        registrando os dados monitorados em sua memória interna. Por conexão internet esses dados
                        são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.
                    </h2>
                    <a href="https://dynamox.net/dynapredict/"><Button type="button" width = 'large' setColor='#263252' setSize='giant'> Ver Mais </Button></a>
                </div>
                <Down>
                    <div className="img">
                        <img src={sensor_tca} alt="sensor_tca"/>
                        <h2>TcA+</h2>
                    </div>
                    <div className="img">
                        <img src={sensor_af} alt="sensor_af"/>
                        <h2>AS</h2>
                    </div>
                    <div className="img">
                        <img src={sensor_hf} alt="sensor_hf"/>
                        <h2>HF</h2>
                    </div>
                </Down>
            </Sensores>
            <Footer/>
        </Container>
    )
};
export default Dashboard;