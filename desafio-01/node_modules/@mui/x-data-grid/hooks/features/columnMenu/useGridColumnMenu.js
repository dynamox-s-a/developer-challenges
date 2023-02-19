import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridLogger, useGridApiMethod, useGridApiEventHandler } from '../../utils';
import { gridColumnMenuSelector } from './columnMenuSelector';
import { gridClasses } from '../../../constants/gridClasses';
export const columnMenuStateInitializer = state => _extends({}, state, {
  columnMenu: {
    open: false
  }
});
/**
 * @requires useGridColumnResize (event)
 * @requires useGridInfiniteLoader (event)
 */

export const useGridColumnMenu = apiRef => {
  const logger = useGridLogger(apiRef, 'useGridColumnMenu');
  /**
   * API METHODS
   */

  const showColumnMenu = React.useCallback(field => {
    const shouldUpdate = apiRef.current.setState(state => {
      if (state.columnMenu.open && state.columnMenu.field === field) {
        return state;
      }

      logger.debug('Opening Column Menu');
      return _extends({}, state, {
        columnMenu: {
          open: true,
          field
        }
      });
    });

    if (shouldUpdate) {
      apiRef.current.hidePreferences();
      apiRef.current.forceUpdate();
    }
  }, [apiRef, logger]);
  const hideColumnMenu = React.useCallback(() => {
    const shouldUpdate = apiRef.current.setState(state => {
      if (!state.columnMenu.open && state.columnMenu.field === undefined) {
        return state;
      }

      logger.debug('Hiding Column Menu');
      return _extends({}, state, {
        columnMenu: _extends({}, state.columnMenu, {
          open: false,
          field: undefined
        })
      });
    });

    if (shouldUpdate) {
      apiRef.current.forceUpdate();
    }
  }, [apiRef, logger]);
  const toggleColumnMenu = React.useCallback(field => {
    logger.debug('Toggle Column Menu');
    const columnMenu = gridColumnMenuSelector(apiRef.current.state);

    if (!columnMenu.open || columnMenu.field !== field) {
      showColumnMenu(field);
    } else {
      hideColumnMenu();
    }
  }, [apiRef, logger, showColumnMenu, hideColumnMenu]);
  const columnMenuApi = {
    showColumnMenu,
    hideColumnMenu,
    toggleColumnMenu
  };
  useGridApiMethod(apiRef, columnMenuApi, 'GridColumnMenuApi');
  /**
   * EVENTS
   */

  const handleColumnHeaderFocus = React.useCallback((params, event) => {
    // Check if the column menu button received focus
    if (!event.target.classList.contains(gridClasses.menuIconButton)) {
      return;
    } // Check if there's an element which lost focus


    if (!event.relatedTarget) {
      return;
    } // `true` if the focus was on the column menu itself, not on any item


    const columnMenuLostFocus = event.relatedTarget.classList.contains(gridClasses.menuList); // `true` if the focus was on an item from the column menu

    const columnMenuItemLostFocus = event.relatedTarget.getAttribute('role') === 'menuitem';

    if (columnMenuLostFocus || columnMenuItemLostFocus) {
      apiRef.current.setColumnHeaderFocus(params.field);
    }
  }, [apiRef]);
  useGridApiEventHandler(apiRef, 'columnResizeStart', hideColumnMenu);
  useGridApiEventHandler(apiRef, 'columnHeaderFocus', handleColumnHeaderFocus);
  useGridApiEventHandler(apiRef, 'virtualScrollerWheel', apiRef.current.hideColumnMenu);
  useGridApiEventHandler(apiRef, 'virtualScrollerTouchMove', apiRef.current.hideColumnMenu);
};