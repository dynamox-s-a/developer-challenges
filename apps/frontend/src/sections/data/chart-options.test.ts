import { describe, expect, it } from 'vitest';

import { makeSeries } from 'src/test/fixtures';
import type { MetricGroup } from 'src/store/measurements/selectors';

import { buildChartOptions, seriesColor, seriesLabel, toChartData, type ChartPalette } from './chart-options';

const palette: ChartPalette = {
  text: '#fff',
  subtext: '#999',
  divider: '#333',
  tooltipBg: '#111',
  buttonText: '#fff',
  buttonBg: 'rgba(145, 158, 171, 0.16)',
  buttonHoverBg: 'rgba(145, 158, 171, 0.32)',
};

const accelerationGroup: MetricGroup = {
  metric: 'acceleration',
  label: 'Aceleração RMS',
  unit: 'g',
  series: [
    makeSeries('accelerationRms/x', 'acceleration', 'x'),
    makeSeries('accelerationRms/y', 'acceleration', 'y'),
  ],
};

const temperatureGroup: MetricGroup = {
  metric: 'temperature',
  label: 'Temperatura',
  unit: '°C',
  series: [makeSeries('temperature', 'temperature', null)],
};

describe('toChartData', () => {
  it('converte cada ponto no par [timestamp, valor]', () => {
    const [first] = toChartData(makeSeries('velocityRms/x', 'velocity', 'x', [7]));

    expect(first).toEqual([Date.UTC(2023, 10, 7), 7]);
  });

  it('descarta pontos com datetime inválido em vez de plotar NaN', () => {
    const series = makeSeries('velocityRms/x', 'velocity', 'x', [1, 2]);
    series.points[0].datetime = 'quebrado';

    expect(toChartData(series)).toHaveLength(1);
  });
});

describe('seriesLabel / seriesColor', () => {
  it('nomeia pelo eixo quando existe e usa a mesma cor por eixo', () => {
    const x = makeSeries('velocityRms/x', 'velocity', 'x');
    const accelX = makeSeries('accelerationRms/x', 'acceleration', 'x');

    expect(seriesLabel(x)).toBe('Eixo X');
    expect(seriesColor(accelX)).toBe(seriesColor(x));
  });

  it('trata série escalar sem eixo', () => {
    const temperature = makeSeries('temperature', 'temperature', null);

    expect(seriesLabel(temperature)).toBe('Leitura');
    expect(seriesColor(temperature)).toBeDefined();
  });
});

describe('buildChartOptions', () => {
  it('usa eixo de tempo com crosshair habilitado', () => {
    const options = buildChartOptions(accelerationGroup, palette);

    expect(options.xAxis).toMatchObject({ type: 'datetime' });
    expect((options.xAxis as Highcharts.XAxisOptions).crosshair).toBeTruthy();
  });

  it('fixa a mesma margem esquerda em todos os gráficos, para o crosshair alinhar', () => {
    const acceleration = buildChartOptions(accelerationGroup, palette);
    const temperature = buildChartOptions(temperatureGroup, palette);

    expect(acceleration.chart?.marginLeft).toBe(temperature.chart?.marginLeft);
  });

  it('mostra legenda só quando há mais de uma série', () => {
    expect(buildChartOptions(accelerationGroup, palette).legend?.enabled).toBe(true);
    expect(buildChartOptions(temperatureGroup, palette).legend?.enabled).toBe(false);
  });

  it('usa tooltip compartilhado com a unidade da grandeza', () => {
    const options = buildChartOptions(temperatureGroup, palette);

    expect(options.tooltip).toMatchObject({ shared: true, valueSuffix: ' °C' });
  });

  it('dá mais casas decimais à aceleração, que opera em valores muito baixos', () => {
    expect(buildChartOptions(accelerationGroup, palette).tooltip?.valueDecimals).toBe(4);
    expect(buildChartOptions(temperatureGroup, palette).tooltip?.valueDecimals).toBe(2);
  });

  it('cria uma série de gráfico por série de dados', () => {
    const options = buildChartOptions(accelerationGroup, palette);

    expect(options.series).toHaveLength(2);
    expect(options.series?.[0]).toMatchObject({ id: 'accelerationRms/x', name: 'Eixo X' });
  });
});
