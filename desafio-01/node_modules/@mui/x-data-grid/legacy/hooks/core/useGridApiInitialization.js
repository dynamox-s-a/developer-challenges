import * as React from 'react';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { EventManager } from '../../utils/EventManager';
import { unstable_resetCreateSelectorCache } from '../../utils/createSelector';

var isSyntheticEvent = function isSyntheticEvent(event) {
  return event.isPropagationStopped !== undefined;
};

var globalId = 0;
export function useGridApiInitialization(inputApiRef, props) {
  var apiRef = React.useRef();

  if (!apiRef.current) {
    apiRef.current = {
      unstable_eventManager: new EventManager(),
      unstable_caches: {},
      state: {},
      instanceId: globalId
    };
    globalId += 1;
  }

  React.useImperativeHandle(inputApiRef, function () {
    return apiRef.current;
  }, [apiRef]);
  var publishEvent = React.useCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var name = args[0],
        params = args[1],
        _args$ = args[2],
        event = _args$ === void 0 ? {} : _args$;
    event.defaultMuiPrevented = false;

    if (isSyntheticEvent(event) && event.isPropagationStopped()) {
      return;
    }

    var details = props.signature === GridSignature.DataGridPro ? {
      api: apiRef.current
    } : {};
    apiRef.current.unstable_eventManager.emit(name, params, event, details);
  }, [apiRef, props.signature]);
  var subscribeEvent = React.useCallback(function (event, handler, options) {
    apiRef.current.unstable_eventManager.on(event, handler, options);
    var api = apiRef.current;
    return function () {
      api.unstable_eventManager.removeListener(event, handler);
    };
  }, [apiRef]);
  var showError = React.useCallback(function (args) {
    apiRef.current.publishEvent('componentError', args);
  }, [apiRef]);
  useGridApiMethod(apiRef, {
    subscribeEvent: subscribeEvent,
    publishEvent: publishEvent,
    showError: showError
  }, 'GridCoreApi');
  React.useEffect(function () {
    var api = apiRef.current;
    return function () {
      unstable_resetCreateSelectorCache(api.instanceId);
      api.publishEvent('unmount');
    };
  }, [apiRef]);
  return apiRef;
}