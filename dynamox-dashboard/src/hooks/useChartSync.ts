import { useState, useCallback, useRef } from 'react';

interface ChartRef {
  updateCrosshair: (x: number) => void;
  getChart: () => any;
}

export const useChartSync = () => {
  const [crosshairX, setCrosshairX] = useState<number | undefined>();
  const chartRefs = useRef<Map<string, ChartRef>>(new Map());

  const registerChart = useCallback((id: string, ref: ChartRef) => {
    chartRefs.current.set(id, ref);
  }, []);

  const unregisterChart = useCallback((id: string) => {
    chartRefs.current.delete(id);
  }, []);

  const handleCrosshairChange = useCallback((x: number, _y: number, sourceId?: string) => {
    setCrosshairX(x);
    
    // Update crosshair on all charts except the source
    chartRefs.current.forEach((ref, id) => {
      if (id !== sourceId) {
        try {
          ref.updateCrosshair(x);
        } catch (error) {
          console.warn(`Failed to update crosshair on chart ${id}:`, error);
        }
      }
    });
  }, []);

  return {
    crosshairX,
    handleCrosshairChange,
    registerChart,
    unregisterChart
  };
};
