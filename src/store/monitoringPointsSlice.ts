import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// defino a estrutura de um ponto de monitoramento com ID, máquina associada, nome e modelo de sensor
export interface MonitoringPoint {
    id: string;        
    machineId: string;
    name: string;
    sensorModel: "TcAg" | "TcAs" | "HF+"; 
}

// defino o estado dos pontos de monitoramento com a lista, status de carregamento e possíveis erros
interface MonitoringPointsState {
    list: MonitoringPoint[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// configuro o estado inicial vazio
const initialState: MonitoringPointsState = {
    list: [],
    status: "idle",
    error: null
}

// criei uma ação assíncrona para buscar todos os pontos de monitoramento da API
export const fetchMonitoringPoints = createAsyncThunk(
    'monitoringPoints/fetchMonitoringPoints', 
    async () => {
        const response = await axios.get('http://localhost:3000/monitoringPoints');
        return response.data;
    }
);

// criei uma ação assíncrona para adicionar um novo ponto de monitoramento à API
export const addMonitoringPoint = createAsyncThunk(
    'monitoringPoints/addMonitoringPoint',
    async (newMonitoringPoint: Omit<MonitoringPoint, 'id'>) => {
        const response = await axios.post('http://localhost:3000/monitoringPoints', newMonitoringPoint);
        return response.data;
    }
);

// crio o slice de pontos de monitoramento com os handlers para cada ação
const monitoringPointsSlice = createSlice({
    name: 'monitoringPoints',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // trato o estado pendente da requisição de busca (carregando)
            .addCase(fetchMonitoringPoints.pending, (state) => {
                state.status = 'loading';
            })
            // trato o sucesso da busca preenchendo a lista de pontos de monitoramento
            .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            // trato o erro da busca salvando a mensagem de erro
            .addCase(fetchMonitoringPoints.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch monitoring points';
            })
            // adiciono um novo ponto de monitoramento à lista após sucesso na criação
            .addCase(addMonitoringPoint.fulfilled, (state, action) => {
                state.list.push(action.payload);
            }); 
    }
});

// exporto o reducer para configurar na store
export default monitoringPointsSlice.reducer;