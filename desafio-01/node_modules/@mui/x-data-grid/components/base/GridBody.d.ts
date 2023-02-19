import * as React from 'react';
interface GridBodyProps {
    children?: React.ReactNode;
    VirtualScrollerComponent: React.JSXElementConstructor<React.HTMLAttributes<HTMLDivElement> & {
        ref: React.Ref<HTMLDivElement>;
        disableVirtualization: boolean;
    }>;
    ColumnHeadersComponent: React.JSXElementConstructor<React.HTMLAttributes<HTMLDivElement> & {
        ref: React.Ref<HTMLDivElement>;
        innerRef: React.Ref<HTMLDivElement>;
    }>;
}
declare function GridBody(props: GridBodyProps): JSX.Element;
declare namespace GridBody {
    var propTypes: any;
}
export { GridBody };
