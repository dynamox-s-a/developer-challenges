import styled from 'styled-components'
import logo from '../assets/images/logo.svg'
import grafismo from '../assets/images/grafismo.svg'
import logo_dynapredict from '../assets/images/logo-dynapredict.svg'
import desktop_and_mobile from '../assets/images/desktop-and-mobile.svg'
import tca3 from '../assets/images/tca3.png'
import as3 from '../assets/images/as3.png'
import hf3 from '../assets/images/hf3.png'

const Header = styled.header`
  width: 100%;
  height: 120px;
  display: flex;
  background-color: #263252; 
`

const LogoLink = styled.a`
  margin: 20px 0 0 60px;
`

const LinksContainer = styled.ul`
  width: 100%;
  display: flex;
  justify-content: right;
  padding-right: 40px;
`

const ItemLink = styled.li`
  color: white;
  margin: 60px 0 0 30px;
  font-family: 'Raleway';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  color: #ffffff;
`

const Link = styled.a`
  a:link {
    color: white;
  }
  a:visited {
    color: white;
  }
`

const DynaPredictSolutionSection = styled.section`
  width: 100%;
  height: 720px;
  display: flex;
  background-image: url(${grafismo});
  @media (max-width:600px) {
   display: flex;
   flex-direction: column;
  }
`

const SensorsSection = styled.section`
  height: 820px;
  background: #F4F7FC;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ContactSection = styled.section`
  height: 450px;
  background: #263252;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const Main = styled.main`
  width: 100%;
  height: 100%;
  display: column;
`

const Page = styled.div`
  max-width: 1280px;
  margin: auto;
  @media (max-width:600px) {
    display: flex;
    flex-direction: column;
  }
`

const SolutionNameContainer = styled.div`
  width: 585px;
  display: flex;
  flex-direction: column;
`

const SolutionName = styled.h2`
  font-family: 'Raleway';
  font-style: normal;
  font-weight: 700;
  font-size: 80px;
  line-height: 94px;
  color: #ffffff;
  margin: 144px 90px 20px 90px;
  @media (max-width: 600px) {
    font-size: 20px;
    line-height: 25px;
  }
`

const DevicesImageContainer = styled.div`
  width: 100%;
  display: flex;
`

const LogoDynaPredict = styled.img`
  width: 161px;
  margin-left: 90px;

`

const DesktopAndMobileImg = styled.img`
  width: 692.06px;
  height: 627px;
  @media (max-width:600px) {
    height: 210px;
  }
 
`

const MaintenanceSensor = styled.h1`
  font-family: 'Raleway';
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 46.96px;
  text-align: center;
  padding-top: 44px;
  margin-bottom: 4px;
`
const MaintenanceSensorText = styled.p`
  font-family: Raleway;
  font-style: normal;
  font-size: 24px;
  font-weight: 400;
  line-height: 28px;
  text-align: center;
  align-items: center;
  display: flex;
  color:  #454545;
  margin: 0 190px;
`

const SeeMoreButton = styled.a`
  width: 183px;
  height: 39px;

  background: #263252;
  border-radius: 5px;

  font-family: 'Raleway';
  font-style: normal;
  font-size: 20px;
  line-height: 23px;
  color: #ffffff;
  margin-top: 35px;

`
const Sensors = styled.div`
  display: flex;
  gap: 65.57px;
`
const DynaSensor = styled.div`
  margin-top: 35px;
  display: flex;
  flex-direction: column;
`

const SensorName = styled.p`
  font-family: Raleway;
  font-size: 40px;
  font-weight: 700;
  line-height: 47px;
  letter-spacing: 0em;
  text-align: center;
  color: #5D7A8C;
  margin-top: 13.46px;
`

const ContactText = styled.h1`
  font-family: 'Raleway';
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 35px;
  text-align: center;

  color: #FFFFFF;
`

const InputName = styled.input`
  width: 426px;
  height: 41px;

  background: #F4F7FC;
  border-radius: 5px;
  font-family: 'Raleway';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;

  color: #454545;

  margin-top: 11px;
`

const SendButton = styled.button`
  width: 183px;
  height: 39px;

  background: #0165DB;
  border-radius: 5px; 
  margin-top: 30px;
  

  font-family: 'Raleway';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 23px;

color: #FFFFFF;
`

const LandingPage = () => {
  return (
    <Page>
      <Header>
        <LogoLink href="https://dynamox.net/" about="blank">
          <img src={logo} alt="logo"></img>
        </LogoLink>

        <LinksContainer>
          <ItemLink>
            <Link href="https://dynamox.net/dynapredict/">DynaPredict</Link>
          </ItemLink>
          <ItemLink>
            <Link href="#sensores">Sensores</Link>
          </ItemLink>
          <ItemLink>
            <Link href="#contato">Contato</Link>
          </ItemLink>
        </LinksContainer>
      </Header>
      <Main>
        <DynaPredictSolutionSection>
          <SolutionNameContainer>
            <SolutionName>Solução DynaPredict</SolutionName>
            <LogoDynaPredict
              src={logo_dynapredict}
              alt="logo dynapredict"
            ></LogoDynaPredict>
          </SolutionNameContainer>
          <DevicesImageContainer>
            <DesktopAndMobileImg
              src={desktop_and_mobile}
              alt="desktop and mobile"
            ></DesktopAndMobileImg>
          </DevicesImageContainer>
        </DynaPredictSolutionSection>

        <SensorsSection id="sensores">
          <MaintenanceSensor>Sensores para manuntenção Preditiva</MaintenanceSensor>
            <MaintenanceSensorText>Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e
              temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway,
              registrando os dados monitorados em sua memória interna. Por conexão internet esses dados
              são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.
            </MaintenanceSensorText>

            <SeeMoreButton href='https://dynamox.net/dynapredict/'>
              Ver mais
            </SeeMoreButton>
            
            <Sensors>
              <DynaSensor>
                <img src={tca3} alt="sensor" />
                <SensorName>TcA+</SensorName>
              </DynaSensor>
              <DynaSensor>
                <img src={as3} alt="sensor" />
                <SensorName>AS</SensorName>
              </DynaSensor>
              <DynaSensor>
              <img src={hf3} alt="sensor" />
              <SensorName>HF</SensorName>
              </DynaSensor>
            
            </Sensors>
          </SensorsSection>

        <ContactSection id="contato">
          <ContactText>Ficou com dúvida? <br></br>
                  Nós entramos em contato com você
          </ContactText>
          <InputName placeholder='Como gostaria de ser chamado?'></InputName>
          <InputName placeholder='Em qual empresa você trabalha?'></InputName>
          <InputName placeholder='Digite aqui o seu email?'></InputName>
          <InputName placeholder='Qual seu telefone?'></InputName>
          <SendButton>Enviar</SendButton>
        </ContactSection>

       
      </Main>
    </Page>
  )
}

export default LandingPage
