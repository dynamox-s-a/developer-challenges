export type MonitoringPoint = {
  id: number,
  name: string,
  type: "TcAg" | "TcAs" | "HF+",
  machineId: number
}
