import './Home.css'
import Grid from '@mui/material/Grid'; // Grid version 1
import Button from '@mui/material/Button';
import sensor1 from '../../assets/images/sensor-tca.png'
import sensor2 from '../../assets/images/sensor-af.png'
import sensor3 from '../../assets/images/sensor-hf.png'
import logoDynapredict from '../../assets/images/logo-dynapredict.png'
import desktop from '../../assets/images/desktop-and-mobile.png'

export function Home() {
  return (
    <section>

      <section className="initial">

        <div className='title'>
          <h1>Solução DynaPredict</h1>
          <img src={logoDynapredict} alt="logo dyna predict" />
        </div>
        <div className='image-initial'>
          <img src={desktop} alt="imagem de um desktop e um celular" />
        </div>

      </section>
      <section className="description">
        <div className='description-text'>
          <h2>Sensores para Manutenção Preditiva</h2>
          <br />
          <h3>Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway, registrando os dados monitorados em sua memória interna. Por conexão internet esses dados são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.</h3>
        </div>

        <Button className='btn' target="_blank" rel="noopener noreferrer" variant="contained" size="medium" href='https://dynamox.net/dynapredict/'>
          VER MAIS
        </Button>

        <div className='description-sensors' padding-top=''>
          <Grid className='sensors' container spacing={2} minHeight={40}>
            <Grid className='sensor' >
              <img src={sensor1} />
              <p>TcA+</p>
            </Grid>
            <Grid className='sensor' >
              <img src={sensor2} />
              <p>AS</p>
            </Grid>
            <Grid className='sensor' >
              <img src={sensor3} />
              <p>HF</p>
            </Grid>
          </Grid>
        </div>
      </section>
    </section>
  );
};