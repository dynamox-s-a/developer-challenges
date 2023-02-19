import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiEventHandler } from '../utils/useGridApiEventHandler';
export function useGridErrorHandler(apiRef, props) {
  const handleError = React.useCallback(args => {
    // We are handling error here, to set up the handler as early as possible and be able to catch error thrown at init time.
    apiRef.current.setState(state => _extends({}, state, {
      error: args
    }));
  }, [apiRef]);
  React.useEffect(() => {
    if (props.error) {
      handleError({
        error: props.error
      });
    } else {
      handleError(null);
    }
  }, [handleError, props.error]);
  useGridApiEventHandler(apiRef, 'componentError', handleError);
}