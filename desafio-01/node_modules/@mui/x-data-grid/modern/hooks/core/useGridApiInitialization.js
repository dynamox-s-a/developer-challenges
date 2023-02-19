import * as React from 'react';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { EventManager } from '../../utils/EventManager';
import { unstable_resetCreateSelectorCache } from '../../utils/createSelector';

const isSyntheticEvent = event => {
  return event.isPropagationStopped !== undefined;
};

let globalId = 0;
export function useGridApiInitialization(inputApiRef, props) {
  const apiRef = React.useRef();

  if (!apiRef.current) {
    apiRef.current = {
      unstable_eventManager: new EventManager(),
      unstable_caches: {},
      state: {},
      instanceId: globalId
    };
    globalId += 1;
  }

  React.useImperativeHandle(inputApiRef, () => apiRef.current, [apiRef]);
  const publishEvent = React.useCallback((...args) => {
    const [name, params, event = {}] = args;
    event.defaultMuiPrevented = false;

    if (isSyntheticEvent(event) && event.isPropagationStopped()) {
      return;
    }

    const details = props.signature === GridSignature.DataGridPro ? {
      api: apiRef.current
    } : {};
    apiRef.current.unstable_eventManager.emit(name, params, event, details);
  }, [apiRef, props.signature]);
  const subscribeEvent = React.useCallback((event, handler, options) => {
    apiRef.current.unstable_eventManager.on(event, handler, options);
    const api = apiRef.current;
    return () => {
      api.unstable_eventManager.removeListener(event, handler);
    };
  }, [apiRef]);
  const showError = React.useCallback(args => {
    apiRef.current.publishEvent('componentError', args);
  }, [apiRef]);
  useGridApiMethod(apiRef, {
    subscribeEvent,
    publishEvent,
    showError
  }, 'GridCoreApi');
  React.useEffect(() => {
    const api = apiRef.current;
    return () => {
      unstable_resetCreateSelectorCache(api.instanceId);
      api.publishEvent('unmount');
    };
  }, [apiRef]);
  return apiRef;
}