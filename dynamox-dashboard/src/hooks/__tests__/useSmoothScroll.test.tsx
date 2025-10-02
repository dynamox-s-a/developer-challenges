import { renderHook } from '@testing-library/react';
import { useSmoothScroll } from '../useSmoothScroll';

// Mock do window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  configurable: true,
  value: mockScrollTo,
});

describe('useSmoothScroll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide scrollToElement and scrollToTop functions', () => {
    const { result } = renderHook(() => useSmoothScroll());
    
    expect(typeof result.current.scrollToElement).toBe('function');
    expect(typeof result.current.scrollToTop).toBe('function');
  });

  it('should scroll to top when scrollToTop is called', () => {
    const { result } = renderHook(() => useSmoothScroll());
    
    result.current.scrollToTop();
    
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('should scroll to element when element exists', () => {
    // Mock do getElementById
    const mockElement = {
      getBoundingClientRect: vi.fn(() => ({
        top: 100,
        left: 0,
        bottom: 200,
        right: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 100,
        toJSON: vi.fn(),
      })),
    };

    Object.defineProperty(document, 'getElementById', {
      writable: true,
      configurable: true,
      value: vi.fn(() => mockElement),
    });

    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });

    const { result } = renderHook(() => useSmoothScroll());
    
    result.current.scrollToElement('test-element', 80);
    
    // Verificar se o scrollTo foi chamado
    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('should not scroll when element does not exist', () => {
    Object.defineProperty(document, 'getElementById', {
      writable: true,
      configurable: true,
      value: vi.fn(() => null),
    });

    const { result } = renderHook(() => useSmoothScroll());
    
    result.current.scrollToElement('non-existent-element');
    
    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});
