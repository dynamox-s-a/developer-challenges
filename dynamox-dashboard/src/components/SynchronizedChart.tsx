import React, { useEffect, useRef } from 'react';
import Chart from './Chart';
import type { ChartRef } from './Chart';
import { useChartSync } from '../hooks/useChartSync';
import type { SensorData } from '../types/sensor';

interface SynchronizedChartProps {
  id: string;
  title: string;
  data: SensorData[];
  color?: string;
  className?: string;
}

const SynchronizedChart: React.FC<SynchronizedChartProps> = ({
  id,
  title,
  data,
  color,
  className
}) => {
  const chartRef = useRef<ChartRef>(null);
  const { handleCrosshairChange, registerChart, unregisterChart } = useChartSync();

  useEffect(() => {
    if (chartRef.current) {
      registerChart(id, chartRef.current);
    }

    return () => {
      unregisterChart(id);
    };
  }, [id, registerChart, unregisterChart]);

  const handleCrosshairChangeLocal = (x: number, y: number) => {
    handleCrosshairChange(x, y, id);
  };

  return (
    <Chart
      ref={chartRef}
      title={title}
      data={data}
      color={color}
      onCrosshairChange={handleCrosshairChangeLocal}
      className={className}
    />
  );
};

export default SynchronizedChart;
