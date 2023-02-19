export declare type UnregisterToken = {
    cleanupToken: number;
};
export declare type UnsubscribeFn = () => void;
export interface CleanupTracking {
    register(object: any, unsubscribe: UnsubscribeFn, unregisterToken: UnregisterToken): void;
    unregister(unregisterToken: UnregisterToken): void;
    reset(): void;
}
