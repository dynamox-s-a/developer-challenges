export interface Machine {
    _id: string;
    name: string;
    type: 'Pump' | 'Fan';
  }
  
  export interface MachineState {
    machines: Machine[];
    loading: boolean;
    error: string | null;
  }
  
  