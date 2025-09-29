import { useState, useEffect, useRef } from 'react';

export const useContainerWidth = () => {
  const [width, setWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    // Definir largura inicial
    updateWidth();

    // Criar ResizeObserver para detectar mudanças no tamanho do container
    const resizeObserver = new ResizeObserver(updateWidth);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { width, containerRef };
};
