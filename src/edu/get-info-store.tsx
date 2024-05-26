import { useSelector } from 'react-redux'
import { useAppSelector } from './eduStore'

export function GetInfoStore(){
  // Buscar Informações na minha store
  const store = useSelector(store => {
    return store
  })

  // Buscar Informações no meu reducer machineData dentro da minha store
  // Argumento (store =>): É toda a store do Redux, e ali de dentro(store => "store") posso passar todas as informações que quero pegar do Redux
  const machineData = useAppSelector(store => {
    return store.machineData
  })

  // Buscar Informações no meu reducer machineData dentro da minha store
  const machineData2 = useAppSelector(store => {
    return store.machineData2
  })

  console.log(store)
  console.log(machineData)
  console.log(machineData2)
  
  return (
    <>
      <ul>
        {machineData.map(machine => {
          return <li key={machine}>{machine}</li>
        })}

        {machineData2.map(machine => {
          return <li key={machine}>{machine}</li>
        })}
      </ul>
    </>
  )
}