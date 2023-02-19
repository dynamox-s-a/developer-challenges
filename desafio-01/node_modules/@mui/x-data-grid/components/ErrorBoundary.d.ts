import * as React from 'react';
import { ErrorInfo } from 'react';
import { GridApiCommunity } from '../models/api/gridApiCommunity';
import { Logger } from '../models/logger';
export interface ErrorBoundaryProps {
    logger: Logger;
    render: ({ error }: any) => React.ReactNode;
    api: React.MutableRefObject<GridApiCommunity>;
    hasError: boolean;
    children?: React.ReactNode;
}
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, any> {
    static getDerivedStateFromError(error: Error): {
        hasError: boolean;
        error: Error;
    };
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    logError(error: Error, errorInfo?: ErrorInfo): void;
    render(): React.ReactNode;
}
