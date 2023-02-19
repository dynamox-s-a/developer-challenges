import * as React from 'react';
export declare type MuiBaseEvent = React.SyntheticEvent<HTMLElement> | DocumentEventMap[keyof DocumentEventMap] | {};
export declare type MuiEvent<E extends MuiBaseEvent = MuiBaseEvent> = E & {
    defaultMuiPrevented?: boolean;
};
