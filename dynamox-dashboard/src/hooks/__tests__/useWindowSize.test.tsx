import { renderHook, act } from '@testing-library/react';
import { useWindowSize } from '../useWindowSize';

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

describe('useWindowSize', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial window size', () => {
    const { result } = renderHook(() => useWindowSize());
    
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it('should update size when window is resized', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useWindowSize());
    
    // Simular resize
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        value: 800,
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 600,
      });
      
      // Disparar evento resize
      window.dispatchEvent(new Event('resize'));
    });

    // Aguardar o debounce
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.width).toBe(800);
    expect(result.current.height).toBe(600);
    
    vi.useRealTimers();
  });

  it('should return initial window size', () => {
    // Este teste verifica se o hook retorna o tamanho inicial correto
    const { result } = renderHook(() => useWindowSize());
    
    // O hook deve retornar o tamanho da janela atual
    expect(typeof result.current.width).toBe('number');
    expect(typeof result.current.height).toBe('number');
    expect(result.current.width).toBeGreaterThan(0);
    expect(result.current.height).toBeGreaterThan(0);
  });
});
