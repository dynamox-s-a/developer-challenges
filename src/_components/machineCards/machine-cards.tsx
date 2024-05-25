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
  helper: 'this machine was improved by bla bla bla'
}

const locationData = {
  icon: pointLocation,
  title: 'Ponto',
  description: '20192',
  helper: 'this pointLocation was improved by bla bla bla'
}

const rpmData = {
  icon: rpmImg,
  description: '200',
  helper: 'this rpm was improved by bla bla bla'
}
const durationData = {
  icon: durationImg,
  description: '16g',
  helper: 'this duration was improved by bla bla bla'
}

const intervalData = {
  icon: intervalImg,
  description: '20 min',
  helper: 'this interval was improved by bla bla bla'
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