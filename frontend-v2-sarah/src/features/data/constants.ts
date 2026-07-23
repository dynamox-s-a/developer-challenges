export const ERROR_MESSAGES = {
  FETCH_METRICS:
    'Não foi possível buscar as métricas dos sensores. Por favor, tente novamente mais tarde.',
  UNEXPECTED_ERROR:
    'Ocorreu um erro inesperado ao processar sua solicitação. Por favor, tente novamente mais tarde.',
  NETWORK_ERROR:
    'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.',
} as const;

export type ErrorMessagesType =
  (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
