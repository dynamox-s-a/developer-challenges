import { Box, Typography } from '@mui/material';
import { createLazyFileRoute } from '@tanstack/react-router';
import Button from '../components/Button';
import SensorTCA from '../assets/tca.svg';
import SensorAS from '../assets/as.svg';
import SensorHF from '../assets/hF.svg';
import NotebookSystem from '../assets/image-notebook.svg';
import LogoSDy from '../assets/logo-dy.svg';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <>
      <section className="cover-section">
        <div className="flex-items">
          <div>
            <Typography
              sx={{ fontSize: '80px', color: '#ffffff', fontWeight: 700, textAlign: 'left' }}
              component={'h1'}
            >
              Solução
            </Typography>
            <Typography
              sx={{ fontSize: '80px', color: '#ffffff', fontWeight: 700, textAlign: 'left' }}
              component={'h1'}
            >
              DynaPredict
            </Typography>
            <img src={LogoSDy} alt="Logo DynaPredict" title="Logo DynaPredict" />
          </div>
          <img
            className="image-notebook"
            src={NotebookSystem}
            alt="Imagem Ilustrativa do Sistema"
            title="Imagem Ilustrativa do Sistema"
          />
        </div>
      </section>
      <section className="see-more">
        <Typography sx={{ fontSize: '3.2vw', color: '#37383D', fontWeight: 700, textAlign: 'center' }} component={'h2'}>
          Sensores para Manutenção Preditiva
        </Typography>
        <Typography
          sx={{ fontSize: '3vmin', color: '#37383D', fontWeight: 400, textAlign: 'center', mb: 4 }}
          component={'p'}
        >
          Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e temperatura embarcados, que
          comunicam por Bluetooth com o App mobile ou Gateway, registrando os dados monitorados em sua memória interna.
          Por conexão internet esses dados são centralizados na Plataforma DynaPredict Web para análise, prognóstico e
          tomada de decisão.
        </Typography>
        <Button className="button button-see-more">VER MAIS</Button>
        <div className="grid-items">
          <img src={SensorTCA} alt="Imagem Ilustrativa do Sensor TcA+" title="Imagem Ilustrativa do Sensor TcA+" />
          <img src={SensorAS} alt="Imagem Ilustrativa do Sensor AS" title="Imagem Ilustrativa do Sensor AS" />
          <img src={SensorHF} alt="Imagem Ilustrativa do Sensor HF" title="Imagem Ilustrativa do Sensor HF" />
        </div>
      </section>
      <section className="form-section">
        <Typography sx={{ fontSize: '3.2vw', fontWeight: 700, textAlign: 'center' }}>Ficou com dúvida?</Typography>
        <Typography sx={{ fontSize: '3.2vw', fontWeight: 700, textAlign: 'center' }}>
          Nós entramos em contato com você
        </Typography>
        <Box component="form" sx={{ m: 1, width: 1, textAlign: 'center' }} noValidate autoComplete="off">
          <div className="input-container">
            <label>Como gostaria de ser chamado?</label>
            <input
              type="text"
              id="nome"
              name="nome"
              aria-label="Como gostaria de ser chamado?"
              placeholder="Como gostaria de ser chamado?"
            />
          </div>
          <div className="input-container">
            <label>Em qual empresa você trabalha?</label>
            <input
              type="text"
              id="empresa"
              name="empresa"
              aria-label="Em qual empresa você trabalha?"
              placeholder="Em qual empresa você trabalha?"
            />
          </div>
          <div className="input-container">
            <label>Digite aqui o seu email</label>
            <input
              type="email"
              id="email"
              name="email"
              aria-label="Digite aqui o seu email"
              placeholder="Digite aqui o seu email"
            />
          </div>
          <div className="input-container">
            <label>Qual o seu telefone?</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              aria-label="Qual o seu telefone?"
              placeholder="Qual o seu telefone?"
            />
          </div>
          <Button className="button button-send">ENVIAR</Button>
        </Box>
      </section>
    </>
  );
}
