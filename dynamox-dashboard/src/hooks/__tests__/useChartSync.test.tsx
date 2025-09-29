import { renderHook, act } from '@testing-library/react';
import { useChartSync } from '../useChartSync';

describe('useChartSync', () => {
  it('should provide registerChart, unregisterChart, and handleCrosshairChange functions', () => {
    const { result } = renderHook(() => useChartSync());
    
    expect(typeof result.current.registerChart).toBe('function');
    expect(typeof result.current.unregisterChart).toBe('function');
    expect(typeof result.current.handleCrosshairChange).toBe('function');
    expect(result.current.crosshairX).toBeUndefined();
  });

  it('should register and unregister charts', () => {
    const { result } = renderHook(() => useChartSync());
    const mockRef = { 
      current: {
        updateCrosshair: vi.fn(),
        getChart: vi.fn()
      }
    } as any;
    
    act(() => {
      result.current.registerChart('chart1', mockRef);
    });
    
    act(() => {
      result.current.unregisterChart('chart1');
    });
    
    // Não deveria haver erro ao tentar unregister novamente
    act(() => {
      result.current.unregisterChart('chart1');
    });
  });

  it('should update crosshairX when handleCrosshairChange is called', () => {
    const { result } = renderHook(() => useChartSync());
    
    act(() => {
      result.current.handleCrosshairChange(100, 50, 'chart1');
    });
    
    expect(result.current.crosshairX).toBe(100);
  });

  it('should update crosshairX with new values', () => {
    const { result } = renderHook(() => useChartSync());
    
    // Primeiro definir um valor
    act(() => {
      result.current.handleCrosshairChange(100, 50, 'chart1');
    });
    
    expect(result.current.crosshairX).toBe(100);
    
    // Atualizar com novo valor
    act(() => {
      result.current.handleCrosshairChange(200, 75, 'chart1');
    });
    
    expect(result.current.crosshairX).toBe(200);
  });
});
