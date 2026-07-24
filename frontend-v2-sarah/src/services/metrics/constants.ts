import {
  ChartTitle,
  MetricLabel,
  YAxisTitle,
  MetricUnit,
} from '../../features/data/types';

export const CHART_TITLE_MAP: Record<string, ChartTitle> = {
  accelerationrms: ChartTitle.ACCELERATION,
  velocityrms: ChartTitle.VELOCITY,
  temperature: ChartTitle.TEMPERATURE,
};

export const LABEL_MAP: Record<string, MetricLabel> = {
  x: MetricLabel.AXIAL,
  y: MetricLabel.HORIZONTAL,
  z: MetricLabel.RADIAL,
  temperature: MetricLabel.TEMPERATURE,
};

export const Y_AXIS_TITLE_MAP: Record<string, YAxisTitle> = {
  accelerationrms: YAxisTitle.ACCELERATION,
  velocityrms: YAxisTitle.VELOCITY,
  temperature: YAxisTitle.TEMPERATURE,
};

export const UNIT_MAP: Record<string, MetricUnit> = {
  accelerationrms: MetricUnit.G,
  velocityrms: MetricUnit.MM_S,
  temperature: MetricUnit.CELSIUS,
};
