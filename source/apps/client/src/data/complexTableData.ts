interface RowsProps {
  id: number | string;
  name: string;
  status: string;
  date: string;
  progress: number;
  quantity: number;
  balance: string;
}

export const rows: RowsProps[] = [
  {
    id: '#P-101',
    name: 'Industrial Pump A1',
    status: 'Approved',
    date: '04 Feb 2026',
    progress: 95,
    quantity: 1200,
    balance: 'Normal',
  },
  {
    id: '#F-202',
    name: 'Exhaust Fan B2',
    status: 'Error',
    date: '04 Feb 2026',
    progress: 45,
    quantity: 850,
    balance: 'Vibration',
  },
  {
    id: '#P-103',
    name: 'Cooling Pump C4',
    status: 'Disable',
    date: '03 Feb 2026',
    progress: 0,
    quantity: 0,
    balance: 'Offline',
  },
  {
    id: '#F-205',
    name: 'Ventilation Fan D1',
    status: 'Approved',
    date: '03 Feb 2026',
    progress: 88,
    quantity: 940,
    balance: 'Normal',
  },
];
