import * as React from 'react';
export interface AutoSizerSize {
    height: number;
    width: number;
}
export interface AutoSizerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onResize'> {
    /**
     * Function responsible for rendering children.
     * @param {AutoSizerSize} size The grid's size.
     * @returns {React.ReactNode} The children to render.
     */
    children: (size: AutoSizerSize) => React.ReactNode;
    /**
     * Default height to use for initial render; useful for SSR.
     * @default null
     */
    defaultHeight?: number;
    /**
     * Default width to use for initial render; useful for SSR.
     * @default null
     */
    defaultWidth?: number;
    /**
     * If `true`, disable dynamic :height property.
     * @default false
     */
    disableHeight?: boolean;
    /**
     * If `true`, disable dynamic :width property.
     * @default false
     */
    disableWidth?: boolean;
    /**
     * Nonce of the inlined stylesheet for Content Security Policy.
     */
    nonce?: string;
    /**
     * Callback to be invoked on-resize.
     * @param {AutoSizerSize} size The grid's size.
     */
    onResize?: (size: AutoSizerSize) => void;
}
declare const GridAutoSizer: React.ForwardRefExoticComponent<AutoSizerProps & React.RefAttributes<HTMLDivElement>>;
export { GridAutoSizer };
