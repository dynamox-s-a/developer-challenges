import { useDispatch } from 'react-redux'
import { add } from './eduStore'

export function ChangeStore(){
  const dispatch = useDispatch()
  const newMachine = 'machine5'
  
  return (
    <>
      <button onClick={() => dispatch(add({ newMachine }))}>useDispatch</button>
    </>
  )
}

// dispatch(add('qualquer coisa)) -> vai enviar um objeto lá para a nossa store. Mais específicamente pra dentro da nossa função add...
// type = nome do reducer(machineData)/slice + nome da ação(add) 