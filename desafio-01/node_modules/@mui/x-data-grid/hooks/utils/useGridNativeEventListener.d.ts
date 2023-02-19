import * as React from 'react';
import { GridApiCommon } from '../../models';
export declare const useGridNativeEventListener: <Api extends GridApiCommon, K extends keyof HTMLElementEventMap>(apiRef: React.MutableRefObject<Api>, ref: React.MutableRefObject<HTMLDivElement | null> | (() => HTMLElement | undefined | null), eventName: K, handler?: ((event: HTMLElementEventMap[K]) => any) | undefined, options?: AddEventListenerOptions) => void;
