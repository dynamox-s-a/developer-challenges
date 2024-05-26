import { Card } from "../ui/card";

import machineImg from '../../assets/figmaIconsSvg/machine.svg'
import pointLocation from '../../assets/figmaIconsSvg/pointLocation.svg'
import rpmImg from '../../assets/figmaIconsSvg/rpm.svg'
import durationImg from '../../assets/figmaIconsSvg/duracao.svg'
import intervalImg from '../../assets/figmaIconsSvg/intervaloAmostras.svg'

const machineData = {
  icon: machineImg,
  title: 'Máquina',
  description: '1023',
  helper: 'Rotating machines convert energy using rotational motion.'
}

const locationData = {
  icon: pointLocation,
  title: 'Ponto',
  description: '20192',
  helper: 'Zone A3 (production line).'
}

const rpmData = {
  icon: rpmImg,
  description: '200',
  helper: 'It measures how many times an object rotates around its axis in one minute.'
}

const durationData = {
  icon: durationImg,
  description: '16g',
  helper: 'industrial machines last from 10 to 30 years with proper care.'
}

const intervalData = {
  icon: intervalImg,
  description: '20 min',
  helper: 'The intervals of a machine.'
}

export function MachineCards(){
  return (
    <>
      <Card data={machineData}/>
      <Card data={locationData}/>
      <Card data={rpmData}/>
      <Card data={durationData}/>
      <Card data={intervalData}/>
    </>
  )
}