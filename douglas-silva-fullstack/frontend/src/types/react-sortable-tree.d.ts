import 'react-sortable-tree';

declare module 'react-sortable-tree' {
  import { ComponentType, ReactNode } from 'react';

  export interface TreeItem<T = Record<string, unknown>> {
    id?: string | number;
    title?: ReactNode;
    subtitle?: ReactNode;
    expanded?: boolean;
    children?: TreeItem<T>[];
    [key: string]: unknown;
  }

  export interface NodeData<T = Record<string, unknown>> {
    node: TreeItem<T>;
    path: (string | number)[];
    treeIndex: number;
  }

  export interface ExtendedNodeData<T = Record<string, unknown>> extends NodeData<T> {
    parentNode: TreeItem<T> | null;
    lowerSiblingCounts: number[];
    isSearchMatch: boolean;
    isSearchFocus: boolean;
  }

  export interface ReactSortableTreeProps<T = Record<string, unknown>> {
    treeData: TreeItem<T>[];
    onChange: (treeData: TreeItem<T>[]) => void;
    nodeContentRenderer?: ComponentType<unknown>;
    canDrag?: boolean | ((data: ExtendedNodeData<T>) => boolean);
    isVirtualized?: boolean;
    generateNodeProps?: (data: ExtendedNodeData<T>) => Record<string, unknown>;
    canNodeHaveChildren?: (node: TreeItem<T>) => boolean;
    [key: string]: unknown;
  }

  const SortableTree: ComponentType<ReactSortableTreeProps>;
  export default SortableTree;
}
