import sensorAs from '../assets/sensor-as.png';
import sensorHf from '../assets/sensor-hf.png';
import sensorTca from '../assets/sensor-tca.png';

const title = "Sensores para Manutenção Preditiva";
const description = "Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway, registrando os dados monitorados em sua memória interna. Por conexão internet esses dados são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão."

const button = {
    title: 'VER MAIS',
    link: 'https://dynamox.net/dynapredict/',
}

const sensors = [
    {
        name: 'TcA+',
        image: sensorTca,
    },
    {
        name: 'AS',
        image: sensorAs,
    },
    {
        name: 'HF',
        image: sensorHf,
    },
]

export {
    title,
    description,
    button,
    sensors
}