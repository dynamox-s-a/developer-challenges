import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import styles from '@component/components/SensorsSection/SensorsSection.module.css'
import sensorTCA from '@assets/sensor-tca.png'
import sensorAS from '@assets/sensor-af.png'
import sensorHF from '@assets/sensor-hf.png'
import Image from 'next/image'

export default function SensorsSection() {

  const sensorImages = [
    {
      url: sensorTCA,
      alt: 'Sensor TcA+',
      title: 'TcA+'
    },
    {
      url: sensorAS,
      alt: 'Sensor AS',
      title: 'AS'
    },
    {
      url: sensorHF,
      alt: 'Sensor HF',
      title: 'HF'
    }
  ];

  return (
    <Box id='sensors-section' className={styles.mainBox}>
      <Box className={styles.textBox}>
        <Typography
          variant='h4'
          component='h4'
        >
          Sensores para Manutenção preditiva
        </Typography>
        <Typography
          component='p'
        >
          Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e
          temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway,
          registrando os dados monitorados em sua memória interna. Por conexão internet esses dados
          são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de
          decisão.
        </Typography>
        <Button
          className={styles.button}
          href='https://dynamox.net/dynapredict/.'
        >
          VER MAIS
        </Button>
      </Box>
      <Box className={styles.imagesBox}>
        {sensorImages.map((sensorImage) => (
          <Box key={sensorImage.title}>
            <Image 
              src={sensorImage.url} 
              alt={sensorImage.alt}
              width={400}
              height={400}
            />
            <Typography
              variant='h6'
              component='h6'
            >
              {sensorImage.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
