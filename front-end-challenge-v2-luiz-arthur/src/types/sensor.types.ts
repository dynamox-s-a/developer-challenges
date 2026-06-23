export interface SensorDataPoint {
    datetime: string;   
    max: number;       
  }
  
  export interface MetricSeries {
    name: string;
    data: SensorDataPoint[];
  }
  
  export type SensorDataResponse = MetricSeries[];
  
  export interface SensorState {
    loading: boolean;
    error: string | null;
    allMetrics: MetricSeries[]; // Guarda a resposta bruta (opcional, mas útil para debug)
    
    acceleration: {
      x: MetricSeries | null;
      y: MetricSeries | null;
      z: MetricSeries | null;
    };
    
    velocity: {
      x: MetricSeries | null;
      y: MetricSeries | null;
      z: MetricSeries | null;
    };
    
    temperature: MetricSeries | null;
  }