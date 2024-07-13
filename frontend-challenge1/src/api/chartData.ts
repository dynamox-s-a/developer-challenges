

interface MetricDataItem {
  datetime: string;
  max: number;
}

interface MetricData {
  name: string;
  data: MetricDataItem[];
}

interface ChartData {
  acceleration: {
    x: [number, number][];
    y: [number, number][];
    z: [number, number][];
  };
  velocity: {
    x: [number, number][];
    y: [number, number][];
    z: [number, number][];
  };
  temperature: [number, number][];
}

export const fetchChartData = async (): Promise<ChartData> => {
  try {
    const responses = await Promise.all([
      fetch('http://localhost:3001/0'),
      fetch('http://localhost:3001/1'),
      fetch('http://localhost:3001/2'),
      fetch('http://localhost:3001/3'),
      fetch('http://localhost:3001/4'),
      fetch('http://localhost:3001/5'),
      fetch('http://localhost:3001/6'),
    ]);

    const checkResponses = responses.every(response => response.ok);
    if (!checkResponses) {
      throw new Error('Falha ao buscar dados da API');
    }

    const [
      accelerationRmsXResponse,
      accelerationRmsYResponse,
      accelerationRmsZResponse,
      velocityRmsXResponse,
      velocityRmsYResponse,
      velocityRmsZResponse,
      temperatureResponse,
    ] = await Promise.all(responses.map(response => response.json() as Promise<MetricData>));

    const accelerationData = {
      x: accelerationRmsXResponse.data.map(item => [
        new Date(item.datetime).getTime(),
        item.max,
      ]) as [number, number][], // Casting para garantir que seja do tipo [number, number][]
      y: accelerationRmsYResponse.data.map(item => [
        new Date(item.datetime).getTime(),
        item.max,
      ]) as [number, number][],
      z: accelerationRmsZResponse.data.map(item => [
        new Date(item.datetime).getTime(),
        item.max,
      ]) as [number, number][],
    };

    const velocityData = {
      x: velocityRmsXResponse.data.map(item => [
        new Date(item.datetime).getTime(),
        item.max,
      ]) as [number, number][],
      y: velocityRmsYResponse.data.map(item => [
        new Date(item.datetime).getTime(),
        item.max,
      ]) as [number, number][],
      z: velocityRmsZResponse.data.map(item => [
        new Date(item.datetime).getTime(),
        item.max,
      ]) as [number, number][],
    };

    const temperatureData = temperatureResponse.data.map(item => [
      new Date(item.datetime).getTime(),
      item.max,
    ]) as [number, number][]; // Casting para garantir que seja do tipo [number, number][]

    return {
      acceleration: accelerationData,
      velocity: velocityData,
      temperature: temperatureData,
    };
  } catch (error) {
    console.error('Erro ao buscar dados do servidor:', error);
    return {
      acceleration: { x: [], y: [], z: [] },
      velocity: { x: [], y: [], z: [] },
      temperature: [],
    };
  }
};
