// Configuração de dados baseada no ambiente
export interface DataConfig {
  useJsonServer: boolean;
  jsonServerUrl: string;
  staticJsonPath: string;
  fallbackToStatic: boolean;
}

const getDataConfig = (): DataConfig => {
  const isDevelopment = import.meta.env.DEV;
  const useJsonServerEnv = import.meta.env.VITE_USE_JSON_SERVER === 'true';
  const jsonServerPort = import.meta.env.VITE_JSON_SERVER_PORT || '3001';
  
  return {
    useJsonServer: isDevelopment && useJsonServerEnv,
    jsonServerUrl: `http://localhost:${jsonServerPort}`,
    staticJsonPath: '/response-challenge-v2.json',
    fallbackToStatic: true, // Sempre fallback para JSON estático se json-server falhar
  };
};

export const dataConfig = getDataConfig();

// Função para detectar se json-server está disponível
export const isJsonServerAvailable = async (): Promise<boolean> => {
  if (!dataConfig.useJsonServer) return false;
  
  try {
    const response = await fetch(`${dataConfig.jsonServerUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000) // 2 segundos de timeout
    });
    return response.ok;
  } catch {
    return false;
  }
};
