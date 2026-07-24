import {
  ChartTitle,
  MetricLabel,
  YAxisTitle,
  MetricUnit,
} from '../../features/data/types';
import theme from '../../theme/theme';

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

export const COLOR_MAP: Record<string, string> = {
  'accelerationrms/x': theme.palette.charts.accelerationX,
  'accelerationrms/y': theme.palette.charts.accelerationY,
  'accelerationrms/z': theme.palette.charts.accelerationZ,
  'velocityrms/x': theme.palette.charts.velocityX,
  'velocityrms/y': theme.palette.charts.velocityY,
  'velocityrms/z': theme.palette.charts.velocityZ,
  temperature: theme.palette.charts.temperature,
};
