import { dataConfig, isJsonServerAvailable } from '../config/dataConfig';
import type { SensorData } from '../types/sensor';

export interface DataServiceResponse {
  data: SensorData[];
  source: 'json-server' | 'static' | 'fallback';
  timestamp: number;
}

class DataService {
  private cache: SensorData[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 30000; // 30 segundos

  /**
   * Busca dados dos sensores com fallback automático
   */
  async fetchSensorData(): Promise<DataServiceResponse> {
    // Verificar cache primeiro
    if (this.cache && this.isCacheValid()) {
      return {
        data: this.cache,
        source: 'static',
        timestamp: this.cacheTimestamp
      };
    }

    // Tentar json-server primeiro se configurado
    if (dataConfig.useJsonServer && dataConfig.fallbackToStatic) {
      try {
        const jsonServerData = await this.fetchFromJsonServer();
        this.updateCache(jsonServerData);
        return {
          data: jsonServerData,
          source: 'json-server',
          timestamp: Date.now()
        };
      } catch (error) {
        console.warn('JSON Server falhou, usando JSON estático:', error);
      }
    }

    // Fallback para JSON estático
    const staticData = await this.fetchFromStatic();
    this.updateCache(staticData);
    return {
      data: staticData,
      source: 'static',
      timestamp: Date.now()
    };
  }

  /**
   * Busca dados do json-server
   */
  private async fetchFromJsonServer(): Promise<SensorData[]> {
    if (!await isJsonServerAvailable()) {
      throw new Error('JSON Server não disponível');
    }

    const response = await fetch(`${dataConfig.jsonServerUrl}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000) // 5 segundos de timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Converter objeto para array se necessário
    return Array.isArray(data) ? data : Object.values(data);
  }

  /**
   * Busca dados do JSON estático
   */
  private async fetchFromStatic(): Promise<SensorData[]> {
    const response = await fetch(dataConfig.staticJsonPath, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000) // 10 segundos de timeout
    });

    if (!response.ok) {
      throw new Error(`Falha ao carregar JSON estático: ${response.status}`);
    }

    const data = await response.json();
    
    // Converter objeto para array se necessário
    return Array.isArray(data) ? data : Object.values(data);
  }

  /**
   * Atualiza cache
   */
  private updateCache(data: SensorData[]): void {
    this.cache = data;
    this.cacheTimestamp = Date.now();
  }

  /**
   * Verifica se cache é válido
   */
  private isCacheValid(): boolean {
    return Date.now() - this.cacheTimestamp < this.CACHE_DURATION;
  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }

  /**
   * Obtém informações sobre a configuração atual
   */
  getConfigInfo() {
    return {
      useJsonServer: dataConfig.useJsonServer,
      jsonServerUrl: dataConfig.jsonServerUrl,
      staticJsonPath: dataConfig.staticJsonPath,
      fallbackToStatic: dataConfig.fallbackToStatic,
      cacheValid: this.isCacheValid(),
      cacheTimestamp: this.cacheTimestamp
    };
  }
}

// Instância singleton
export const dataService = new DataService();
