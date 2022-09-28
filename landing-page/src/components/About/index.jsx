import sensorAS from '../../assets/sensor-af.png';
import sensorHF from '../../assets/sensor-hf.png';
import sensorTcA from '../../assets/sensor-tca.png';
import './styles.css';

export function About() {
  return(
    <section className="grid-pattern">
      <div className="about-section">

        <div className="about-content">
          <h2 className="title">Sensores para Manutenção Preditiva</h2>
          
          <p>Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway, registrando os dados monitorados em sua memória interna. Por conexão internet esses dados são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.</p>
          
          <button>VER MAIS</button>

          <div className="about-image">
            <div className="card-image">
              <img src={sensorTcA} alt="Imagem do sensor TcA" />
              <p>TcA+</p>
            </div>

            <div className="card-image">
              <img src={sensorAS} alt="Imagem do sensor AS" />
              <p>AS</p>
            </div>

            <div className="card-image">
              <img src={sensorHF} alt="Imagem do sensor HF" />
              <p>HF</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}