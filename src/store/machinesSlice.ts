import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// defino a estrutura de uma máquina com ID, nome e tipo
export interface Machine {
    id: string,
    name: string,
    type: 'Pump' | 'Fan';
}

// defino o estado das máquinas com a lista, status de carregamento e possíveis erros
interface MachinesState {
    list: Machine[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// configuro o estado inicial vazio
const initialState: MachinesState = {
    list: [],
    status: 'idle',
    error: null,
};

// criei uma ação assíncrona para buscar todas as máquinas da API
export const fetchMachines = createAsyncThunk('machines/fetchMachines', async () => {
    const response = await axios.get('http://localhost:3000/machines');
    return response.data;
});

// criei uma ação assíncrona para adicionar uma nova máquina à API
export const addMachine = createAsyncThunk('machines/addMachine', async (newMachine: Omit<Machine, 'id'>) => {
    const response = await axios.post('http://localhost:3000/machines', newMachine);
    return response.data;
});

// criei uma ação assíncrona para atualizar uma máquina existente na API
export const updateMachine = createAsyncThunk('machines/updateMachine', async (updateMachine: Machine) => {
    const response = await axios.put(`http://localhost:3000/machines/${updateMachine.id}`, updateMachine);
    return response.data;
});

// criei uma ação assíncrona para deletar uma máquina da API
export const deleteMachine = createAsyncThunk('machines/deleteMachine', async (machineId: string) => {
    await axios.delete(`http://localhost:3000/machines/${machineId}`);
    return machineId;
});

// crio o slice de máquinas com os handlers para cada ação
const machinesSlice = createSlice({
    name: 'machines',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // trato o estado pendente da requisição de busca (carregando)
            .addCase(fetchMachines.pending, (state) => {
                state.status = 'loading';
            })
            // trato o sucesso da busca preenchendo a lista de máquinas
            .addCase(fetchMachines.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            // trato o erro da busca salvando a mensagem de erro
            .addCase(fetchMachines.rejected, (state, action)=> {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch machines';
            })
            // adiciono uma nova máquina à lista após sucesso na criação
            .addCase(addMachine.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            // atualizo a máquina na lista após sucesso na edição
            .addCase(updateMachine.fulfilled, (state, action) => {
                const index = state.list.findIndex(machine => machine.id === action.payload.id);    
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            // removo a máquina da lista após sucesso na deleção
            .addCase(deleteMachine.fulfilled, (state, action) => {
                state.list = state.list.filter(machine => machine.id !== action.payload);
            });
        
        }
});

// exporto o reducer para configurar na store
export default machinesSlice.reducer;