export interface DataPoint {
  datetime: string;
  max: number;
}

export interface Data {
  data: DataPoint[];
}

export interface CombinedData {
  time: string[];
  acceleration: {
    x: Data & { name: string };
    y: Data & { name: string };
    z: Data & { name: string };
  };
  velocity: {
    x: Data;
    y: Data;
    z: Data;
  };
  temperature: Data;
}

export interface RootState {
  data: CombinedData;
  loading: boolean;
}

export interface FetchDataFailureAction {
  type: string;
  payload: {
    message: string;
  };
}

export interface FetchDataSuccessAction {
  type: string;
  payload: CombinedData;
}
