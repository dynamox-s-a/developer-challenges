export interface PiChartDataProps {
  id: number | string;
  value: number;
  name: string;
  visible: boolean;
}

export const PiChartData: PiChartDataProps[] = [
  { id: 1, value: 45, name: 'TcAg', visible: true },
  { id: 2, value: 30, name: 'TcAs', visible: true },
  { id: 3, value: 25, name: 'HF+', visible: true },
];
