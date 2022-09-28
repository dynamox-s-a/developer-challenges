import Container from '../Container'
import Card from '../Card'

import * as S from './styles'

function Sensors() {
  return (
    <S.SensorsContainer>
      <Container>
        <S.ArticleContainer>
            <h2>Sensores para Manutenção Preditiva</h2>
            <p>
                Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e <br/>
                temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway, <br/>
                registrando os dados monitorados em sua memória interna. Por conexão internet esses dados <br/>
                são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.
            </p>
            <a href="https://dynamox.net/dynapredict/">Ver mais</a>
          <S.ImagesContainer>
            <Card 
              src="/assets/sensor-tca.png"
              description="TcA+"
            />
            <Card 
              src="/assets/sensor-af.png"
              description="AS"
            />
            <Card 
              src="/assets/sensor-hf.png"
              description="HF"
            />
          </S.ImagesContainer>
        </S.ArticleContainer>
      </Container>
    </S.SensorsContainer>
  )
}

export default Sensors