import type { SensorData } from '../types/sensor';

export const filterSensorsByType = (data: SensorData[], type: string): SensorData[] => {
  return data.filter(sensor => 
    sensor.name.toLowerCase().includes(type.toLowerCase())
  );
};

export const getSensorTypes = (data: SensorData[]): string[] => {
  const types = new Set<string>();
  
  data.forEach(sensor => {
    const lowerName = sensor.name.toLowerCase();
    if (lowerName.includes('acceleration')) {
      types.add('acceleration');
    } else if (lowerName.includes('velocity') || lowerName.includes('speed')) {
      types.add('velocity');
    } else if (lowerName.includes('temperature') || lowerName.includes('temp')) {
      types.add('temperature');
    }
  });
  
  return Array.from(types);
};

export const getSensorColor = (type: string): string => {
  const colors = {
    acceleration: '#e74c3c',
    velocity: '#3498db', 
    temperature: '#f39c12'
  };
  
  return colors[type as keyof typeof colors] || '#1976d2';
};

export const getSensorDisplayName = (type: string): string => {
  const names = {
    acceleration: 'Aceleração',
    velocity: 'Velocidade',
    temperature: 'Temperatura'
  };
  
  return names[type as keyof typeof names] || type;
};
