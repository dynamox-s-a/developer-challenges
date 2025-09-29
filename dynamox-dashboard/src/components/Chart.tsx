import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styled from 'styled-components';
import type { SensorData } from '../types/sensor';
import { useWindowSize } from '../hooks/useWindowSize';

const ChartContainer = styled.div<{ $width: number }>`
  width: 100%;
  height: ${props => {
    if (props.$width < 480) return '400px';
    if (props.$width < 768) return '350px';
    return '400px';
  }};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ChartTitle = styled.h3<{ $width: number }>`
  margin: 0 0 ${props => {
    if (props.$width < 480) return '8px';
    if (props.$width < 768) return '12px';
    return '16px';
  }} 0;
  font-size: ${props => {
    if (props.$width < 480) return '1.1rem';
    if (props.$width < 768) return '1.25rem';
    return '1.5rem';
  }};
  font-weight: 600;
  color: #1976d2;
  text-align: center;
`;

interface ChartProps {
  title: string;
  data: SensorData[];
  color?: string;
  onCrosshairChange?: (x: number, y: number) => void;
  crosshairX?: number;
  className?: string;
}

export interface ChartRef {
  updateCrosshair: (x: number) => void;
  getChart: () => Highcharts.Chart | undefined;
}

const Chart = forwardRef<ChartRef, ChartProps>(({
  title,
  data,
  color = '#1976d2',
  onCrosshairChange,
  crosshairX,
  className
}, ref) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const { width } = useWindowSize();

  useImperativeHandle(ref, () => ({
    updateCrosshair: (x: number) => {
      const chart = chartRef.current?.chart;
      if (chart) {
        // Update crosshair by triggering a mousemove event at the x position
        const event = new MouseEvent('mousemove', {
          clientX: chart.plotLeft + chart.xAxis[0].toPixels(x),
          clientY: chart.plotTop + chart.plotHeight / 2
        });
        chart.container.dispatchEvent(event);
      }
    },
    getChart: () => chartRef.current?.chart
  }));

  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (chart && crosshairX !== undefined) {
      // Update crosshair by triggering a mousemove event at the x position
      const event = new MouseEvent('mousemove', {
        clientX: chart.plotLeft + chart.xAxis[0].toPixels(crosshairX),
        clientY: chart.plotTop + chart.plotHeight / 2
      });
      chart.container.dispatchEvent(event);
    }
  }, [crosshairX]);

  const formatDataForChart = (sensorData: SensorData[]) => {
    if (!Array.isArray(sensorData) || sensorData.length === 0) {
      return [];
    }
    
    return sensorData.map(sensor => ({
      name: sensor.name,
      data: sensor.data.map(point => [
        new Date(point.datetime).getTime(),
        point.max
      ]),
      type: 'line' as const,
      color: color,
      lineWidth: 2,
      marker: {
        enabled: false
      }
    }));
  };

  const chartData = formatDataForChart(data);

  const chartOptions: Highcharts.Options = {
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Data/Hora'
      },
      crosshair: {
        width: 1,
        color: '#666',
        dashStyle: 'Dash'
      }
    },
    yAxis: {
      title: {
        text: 'Valor'
      },
      crosshair: {
        width: 1,
        color: '#666',
        dashStyle: 'Dash'
      },
      min: 0,
      startOnTick: false,
      endOnTick: false
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false
        },
        states: {
          hover: {
            lineWidth: 3
          }
        }
      },
      series: {
        events: {
          mouseOver: function() {
            if (onCrosshairChange) {
              onCrosshairChange(this.xAxis.categories?.indexOf(this.name) || 0, 0);
            }
          }
        }
      }
    },
    tooltip: {
      shared: true,
      formatter: function() {
        const points = this.points || [];
        let tooltip = `<b>${Highcharts.dateFormat('%d/%m/%Y %H:%M', this.x)}</b><br/>`;
        
        points.forEach(point => {
          tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b><br/>`;
        });
        
        return tooltip;
      }
    },
    accessibility: {
      enabled: false
    },
    series: chartData,
    chart: {
      backgroundColor: 'transparent',
      events: {
        load: function() {
          const chart = this;
          
          // Add mouse move event for crosshair synchronization
          chart.container.addEventListener('mousemove', function(e: MouseEvent) {
            const x = chart.xAxis[0].toValue(e.offsetX);
            if (onCrosshairChange) {
              onCrosshairChange(x, 0);
            }
          });
        }
      }
    }
  };

  return (
    <div className={className}>
      <ChartTitle $width={width}>{title}</ChartTitle>
      <ChartContainer $width={width}>
        {chartData.length > 0 ? (
          <HighchartsReact
            ref={chartRef}
            highcharts={Highcharts}
            options={chartOptions}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#666',
            fontSize: '16px'
          }}>
            Nenhum dado disponível para {title}
          </div>
        )}
      </ChartContainer>
    </div>
  );
});

Chart.displayName = 'Chart';

export default Chart;
