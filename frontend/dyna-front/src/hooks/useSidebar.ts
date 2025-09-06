
import { useState } from 'react';

interface UseSidebarReturn {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
}

/**
 * Hook customizado para gerenciar estado do sidebar
 * Permite funcionalidades futuras como colapsar/expandir
 */
export const useSidebar = (): UseSidebarReturn => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = (): void => {
    setIsCollapsed(prev => !prev);
  };

  const collapseSidebar = (): void => {
    setIsCollapsed(true);
  };

  const expandSidebar = (): void => {
    setIsCollapsed(false);
  };

  return {
    isCollapsed,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
  };
};
