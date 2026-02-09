export type SensorData = {
    id: string,
    temp: number,
    vibration: number,
    timestamp: string,
    sensorId: string
}

export type SensorDataState = {
    items: SensorData[],
    isLoading: boolean
}