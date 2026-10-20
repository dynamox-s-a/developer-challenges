import type {
  ChartData,
  MachineDto,
  SeriesDto,
} from "../../../features/data/types";

export const machineFixture: MachineDto = {
  name: "Máquina 1023",
  point: "Ponto 20192",
  sampleRate: 200,
  interval: "20 min",
  range: "16g",
};

export const chartsFixture: ChartData = {
  acceleration: [
    {
      name: "Axial",
      data: [
        [1, 0.1],
        [2, 0.2],
      ],
    },
    {
      name: "Horizontal",
      data: [
        [1, 0.1],
        [2, 0.2],
      ],
    },
    {
      name: "Radial",
      data: [
        [1, 0.1],
        [2, 0.2],
      ],
    },
  ],
  velocity: [
    {
      name: "Axial",
      data: [
        [1, 0.1],
        [2, 0.2],
      ],
    },
    {
      name: "Horizontal",
      data: [
        [1, 0.1],
        [2, 0.2],
      ],
    },
    {
      name: "Radial",
      data: [
        [1, 0.1],
        [2, 0.2],
      ],
    },
  ],
  temperature: [
    {
      name: "Temperatura",
      data: [
        [1, 20],
        [2, 21],
      ],
    },
  ],
};

const dto = (name: SeriesDto["name"], values: number[]): SeriesDto => ({
  name,
  data: [
    { datetime: "2023-11-07T11:53:38.187Z", max: values[0] },
    { datetime: "2023-11-07T15:59:08.000Z", max: values[1] },
    { datetime: "2023-11-07T19:59:08.000Z", max: values[2] },
  ],
});

export const seriesDtoFixture: SeriesDto[] = [
  dto("accelerationRms/x", [0.1, 0.2, 0.3]),
  dto("accelerationRms/y", [0.4, 0.5, 0.6]),
  dto("accelerationRms/z", [0.7, 0.8, 0.9]),
  dto("velocityRms/x", [1, 2, 3]),
  dto("velocityRms/y", [4, 5, 6]),
  dto("velocityRms/z", [7, 8, 9]),
  dto("temperature", [20, 21, 22]),
];
