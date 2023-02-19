import { MuiBaseEvent } from '../muiEvent';
import { GridEventLookup } from './gridEventLookup';
import { GridEventsStr } from './gridEvents';
declare type PublisherArgsNoEvent<E extends GridEventsStr, T extends {
    params: any;
}> = [E, T['params']];
declare type PublisherArgsRequiredEvent<E extends GridEventsStr, T extends {
    params: any;
    event: MuiBaseEvent;
}> = [E, T['params'], T['event']];
declare type PublisherArgsOptionalEvent<E extends GridEventsStr, T extends {
    params: any;
    event: MuiBaseEvent;
}> = PublisherArgsRequiredEvent<E, T> | PublisherArgsNoEvent<E, T>;
declare type PublisherArgsEvent<E extends GridEventsStr, T extends {
    params: any;
    event: MuiBaseEvent;
}> = {} extends T['event'] ? PublisherArgsOptionalEvent<E, T> : PublisherArgsRequiredEvent<E, T>;
declare type PublisherArgsParams<E extends GridEventsStr, T extends {
    params: any;
}> = [E, T['params']];
declare type PublisherArgsNoParams<E extends GridEventsStr> = [E];
declare type GridEventPublisherArg<E extends GridEventsStr, T> = T extends {
    params: any;
    event: MuiBaseEvent;
} ? PublisherArgsEvent<E, T> : T extends {
    params: any;
} ? PublisherArgsParams<E, T> : PublisherArgsNoParams<E>;
export declare type GridEventPublisher = <E extends GridEventsStr>(...params: GridEventPublisherArg<E, GridEventLookup[E]>) => void;
export {};
