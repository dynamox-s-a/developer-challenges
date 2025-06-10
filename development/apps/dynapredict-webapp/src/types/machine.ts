export interface Machine {
  id: number;
  name: string;
  type: 'Pump' | 'Fan';
  createdAt: Date;
  userId: number;
}