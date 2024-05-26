import { configureStore, createSlice } from '@reduxjs/toolkit'
import { useSelector, TypedUseSelectorHook } from 'react-redux'

const machineDataSlice = createSlice({
  name: 'machineData',
  initialState: ['machine1', 'machine2'],

  reducers: {
    add: (state, action) => {
      console.log(state, action)
      state.push(action.payload.newMachine)
    }
  }
})

const machineDataSlice2 = createSlice({
  name: 'machineData',
  initialState: ['machine3', 'machine4'],

  reducers: {
    
  }
})

export const eduStore = configureStore({
  reducer: {
    machineData: machineDataSlice.reducer,
    machineData2: machineDataSlice2.reducer
  }
})

export const { add } = machineDataSlice.actions

export type RootState = ReturnType<typeof eduStore.getState> 
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// STORE - Estado Global
// REDUCER(ReduxToolkit: chamamos de Slices(função que cria esses pedacinhos de estado global)) -> É as informações que a gente vai compartilhar entre todas os componentes da nossa app
// REDUCER - Passa-se um objeto com as minhas fatias(meus createSlices)
// REDUCER/CREATESLICE - Todo pedaço menor do estado precisa ter um 1. nome/ 2. initialState(valor que vai iniciar)/ 3. reducers


// Provider(Usa context API de plano de fundo) em App.tsx -> Fazer para meus componentes acessarem as info's do nosso store -> npm i react-redux(integração react + redux: fornece para nós o provider)


// useSelector no componente -> Para buscar as informações da store
// useSelector(store => store) -> para ter acesso a store
// useSelector(store => store.machineData) -> N quero o store todo, Quero pegar apenas o reducer de machineData


// useDispatch() + add function (from export const { add } = machineDataSlice.actions )

// Typar nosso useSelector:
  // getState --> Retorna todo o meu estado
  // typeof getState --> retorna o FORMATO do meu estado
  // ReturnType<typeof store.getState> --> getState é uma função(), typeof pega o tipo, e queremos pegar o tipo do RETORNO da função 
  // RootState --> const que armazena o formato do nosso estado
  // useAppSelector --> função criada para usar igual usamos o nosso useSelector nativo
  // RootState --> Typahgem do nosso estado global
  // TypedUseSelectorHook --> Typagem
