export interface PostResult {
  SUCCESS: string;
  DATA_CONFLICT: string;
  BAD_CREDENTIALS: string;
  BAD_RESPONSE: string;
  FETCH_ERROR: string;
  UNKNOW_ERROR: string;
}

export const userPostResultMsg: PostResult = {
  SUCCESS: "Usuário criado com sucesso",
  DATA_CONFLICT: "Um usuário com esse email já está cadastrado",
  BAD_CREDENTIALS: "Você precisa estar logado",
  BAD_RESPONSE: "Servidor respondeu de forma inesperada",
  FETCH_ERROR: "Servidor parece estar offline. Tente mais tarde",
  UNKNOW_ERROR: "Erro desconhecido",
};

export const sensorPostResultMsg: PostResult = {
  SUCCESS: "Sensor criado com sucesso",
  DATA_CONFLICT: "Um sensor com esse nome já está cadastrado",
  BAD_CREDENTIALS: "Você precisa estar logado",
  BAD_RESPONSE: "Servidor respondeu de forma inesperada",
  FETCH_ERROR: "Servidor parece estar offline. Tente mais tarde",
  UNKNOW_ERROR: "Erro desconhecido",
};

export const monitoringPointPostResultMsg: PostResult = {
  SUCCESS: "Ponto de monitoramento criado com sucesso",
  DATA_CONFLICT: "Um ponto de motinoramento com esse nome já está cadastrado",
  BAD_CREDENTIALS: "Você precisa estar logado",
  BAD_RESPONSE: "Servidor respondeu de forma inesperada",
  FETCH_ERROR: "Servidor parece estar offline. Tente mais tarde",
  UNKNOW_ERROR: "Erro desconhecido",
};

export const machinePostResultMsg: PostResult = {
  SUCCESS: "Máquina criado com sucesso",
  DATA_CONFLICT: "Uma máquina com esse nome já está cadastrada",
  BAD_CREDENTIALS: "Você precisa estar logado",
  BAD_RESPONSE: "Servidor respondeu de forma inesperada",
  FETCH_ERROR: "Servidor parece estar offline. Tente mais tarde",
  UNKNOW_ERROR: "Erro desconhecido",
};
