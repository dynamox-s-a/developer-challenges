import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import machinesReducer from './machinesSlice';
import monitoringPointsReducer from './monitoringPointsSlice';

// configuro a store central do Redux com todos os reducers da aplicação
export const store = configureStore({
  reducer: {
    // adiciono o reducer de autenticação para gerenciar login/logout
    auth: authReducer,
    // adiciono o reducer de máquinas para gerenciar a lista de máquinas
    machines: machinesReducer,
    // adiciono o reducer de pontos de monitoramento para gerenciar sensores
    monitoringPoints: monitoringPointsReducer,
  },
});

// exporto o tipo RootState para usar em seletores do Redux em toda a aplicação
export type RootState = ReturnType<typeof store.getState>;

// exporto o tipo AppDispatch para tipar corretamente o dispatch em componentes
export type AppDispatch = typeof store.dispatch;