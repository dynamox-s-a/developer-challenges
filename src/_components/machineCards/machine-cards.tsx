import { Card } from "../ui/card";

import machineImg from '../../assets/figmaIconsSvg/machine.svg'
import pointLocation from '../../assets/figmaIconsSvg/pointLocation.svg'
import rpmImg from '../../assets/figmaIconsSvg/rpm.svg'
import durationImg from '../../assets/figmaIconsSvg/duracao.svg'
import intervalImg from '../../assets/figmaIconsSvg/intervaloAmostras.svg'
import { useAppSelector } from "../../store";

export function MachineCards(){
  const machineResponse = useAppSelector(store => store.machinesData.data);

  const machineData = machineResponse.find(item => item.type === 'machine');
  const locationData = machineResponse.find(item => item.type === 'location');
  const rpmData = machineResponse.find(item => item.type === 'rpm');
  const durationData = machineResponse.find(item => item.type === 'duration');
  const intervalData = machineResponse.find(item => item.type === 'interval');

  return (
    <>
      {machineData && <Card data={machineData} icon={machineImg} />}
      {locationData && <Card data={locationData} icon={pointLocation} />}
      {rpmData && <Card data={rpmData} icon={rpmImg} />}
      {durationData && <Card data={durationData} icon={durationImg} />}
      {intervalData && <Card data={intervalData} icon={intervalImg} />}
    </>
  )
}