"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderActionsCell = exports.GridActionsCell = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));

var _MenuList = _interopRequireDefault(require("@mui/material/MenuList"));

var _utils = require("@mui/material/utils");

var _gridClasses = require("../../constants/gridClasses");

var _GridMenu = require("../menu/GridMenu");

var _useGridRootProps = require("../../hooks/utils/useGridRootProps");

var _useGridApiContext = require("../../hooks/utils/useGridApiContext");

var _jsxRuntime = require("react/jsx-runtime");

const _excluded = ["colDef", "id", "api", "hasFocus", "isEditable", "field", "value", "formattedValue", "row", "rowNode", "cellMode", "getValue", "tabIndex", "position", "focusElementRef"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const hasActions = colDef => typeof colDef.getActions === 'function';

const GridActionsCell = props => {
  const {
    colDef,
    id,
    hasFocus,
    tabIndex,
    position = 'bottom-end',
    focusElementRef
  } = props,
        other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const [focusedButtonIndex, setFocusedButtonIndex] = React.useState(-1);
  const [open, setOpen] = React.useState(false);
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const ignoreCallToFocus = React.useRef(false);
  const touchRippleRefs = React.useRef({});
  const menuId = (0, _utils.unstable_useId)();
  const buttonId = (0, _utils.unstable_useId)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  React.useLayoutEffect(() => {
    if (!hasFocus) {
      Object.entries(touchRippleRefs.current).forEach(([index, ref]) => {
        ref == null ? void 0 : ref.stop({}, () => {
          delete touchRippleRefs.current[index];
        });
      });
    }
  }, [hasFocus]);
  React.useEffect(() => {
    if (focusedButtonIndex < 0 || !rootRef.current) {
      return;
    }

    if (focusedButtonIndex >= rootRef.current.children.length) {
      return;
    }

    const child = rootRef.current.children[focusedButtonIndex];
    child.focus({
      preventScroll: true
    });
  }, [focusedButtonIndex]);
  React.useEffect(() => {
    if (!hasFocus) {
      setFocusedButtonIndex(-1);
      ignoreCallToFocus.current = false;
    }
  }, [hasFocus]);
  React.useImperativeHandle(focusElementRef, () => ({
    focus() {
      // If ignoreCallToFocus is true, then one of the buttons was clicked and the focus is already set
      if (!ignoreCallToFocus.current) {
        setFocusedButtonIndex(0);
      }
    }

  }), []);

  if (!hasActions(colDef)) {
    throw new Error('MUI: Missing the `getActions` property in the `GridColDef`.');
  }

  const options = colDef.getActions(apiRef.current.getRowParams(id));
  const iconButtons = options.filter(option => !option.props.showInMenu);
  const menuButtons = options.filter(option => option.props.showInMenu);
  const numberOfButtons = iconButtons.length + (menuButtons.length ? 1 : 0);
  React.useEffect(() => {
    if (focusedButtonIndex >= numberOfButtons) {
      setFocusedButtonIndex(numberOfButtons - 1);
    }
  }, [focusedButtonIndex, numberOfButtons]);

  const showMenu = () => {
    setOpen(true);
    setFocusedButtonIndex(numberOfButtons - 1);
    ignoreCallToFocus.current = true;
  };

  const hideMenu = () => {
    setOpen(false);
  };

  const handleTouchRippleRef = index => instance => {
    touchRippleRefs.current[index] = instance;
  };

  const handleButtonClick = (index, onClick) => event => {
    setFocusedButtonIndex(index);
    ignoreCallToFocus.current = true;

    if (onClick) {
      onClick(event);
    }
  };

  const handleRootKeyDown = event => {
    if (numberOfButtons <= 1) {
      return;
    }

    let newIndex = focusedButtonIndex;

    if (event.key === 'ArrowRight') {
      newIndex += 1;
    } else if (event.key === 'ArrowLeft') {
      newIndex -= 1;
    }

    if (newIndex < 0 || newIndex >= numberOfButtons) {
      return; // We're already in the first or last item = do nothing and let the grid listen the event
    }

    if (newIndex !== focusedButtonIndex) {
      event.preventDefault(); // Prevent scrolling

      event.stopPropagation(); // Don't stop propagation for other keys, e.g. ArrowUp

      setFocusedButtonIndex(newIndex);
    }
  };

  const handleListKeyDown = event => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }

    if (['Tab', 'Enter', 'Escape'].includes(event.key)) {
      hideMenu();
    }
  };

  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", (0, _extends2.default)({
    role: "menu",
    ref: rootRef,
    tabIndex: -1,
    className: _gridClasses.gridClasses.actionsCell,
    onKeyDown: handleRootKeyDown
  }, other, {
    children: [iconButtons.map((button, index) => /*#__PURE__*/React.cloneElement(button, {
      key: index,
      touchRippleRef: handleTouchRippleRef(index),
      onClick: handleButtonClick(index, button.props.onClick),
      tabIndex: focusedButtonIndex === index ? tabIndex : -1
    })), menuButtons.length > 0 && buttonId && /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
      ref: buttonRef,
      id: buttonId,
      "aria-label": apiRef.current.getLocaleText('actionsCellMore'),
      "aria-controls": menuId,
      "aria-expanded": open ? 'true' : undefined,
      "aria-haspopup": "true",
      role: "menuitem",
      size: "small",
      onClick: showMenu,
      touchRippleRef: handleTouchRippleRef(buttonId),
      tabIndex: focusedButtonIndex === iconButtons.length ? tabIndex : -1,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.MoreActionsIcon, {
        fontSize: "small"
      })
    }), menuButtons.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridMenu.GridMenu, {
      onClickAway: hideMenu,
      onClick: hideMenu,
      open: open,
      target: buttonRef.current,
      position: position,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuList.default, {
        id: menuId,
        className: _gridClasses.gridClasses.menuList,
        onKeyDown: handleListKeyDown,
        "aria-labelledby": buttonId,
        variant: "menu",
        autoFocusItem: true,
        children: menuButtons.map((button, index) => /*#__PURE__*/React.cloneElement(button, {
          key: index
        }))
      })
    })]
  }));
};

exports.GridActionsCell = GridActionsCell;
process.env.NODE_ENV !== "production" ? GridActionsCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------

  /**
   * GridApi that let you manipulate the grid.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: _propTypes.default.any.isRequired,

  /**
   * The mode of the cell.
   */
  cellMode: _propTypes.default.oneOf(['edit', 'view']).isRequired,

  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: _propTypes.default.object.isRequired,

  /**
   * The column field of the cell that triggered the event.
   */
  field: _propTypes.default.string.isRequired,

  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.shape({
      focus: _propTypes.default.func.isRequired
    })
  })]),
  formattedValue: _propTypes.default.any,

  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {any} The cell value.
   * @deprecated Use `params.row` to directly access the fields you want instead.
   */
  getValue: _propTypes.default.func.isRequired,

  /**
   * If true, the cell is the active element.
   */
  hasFocus: _propTypes.default.bool.isRequired,

  /**
   * The grid row id.
   */
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,

  /**
   * If true, the cell is editable.
   */
  isEditable: _propTypes.default.bool,
  position: _propTypes.default.oneOf(['bottom-end', 'bottom-start', 'bottom', 'left-end', 'left-start', 'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top']),

  /**
   * The row model of the row that the current cell belongs to.
   */
  row: _propTypes.default.any.isRequired,

  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: _propTypes.default.object.isRequired,

  /**
   * the tabIndex value.
   */
  tabIndex: _propTypes.default.oneOf([-1, 0]).isRequired,
  value: _propTypes.default.any
} : void 0;

const renderActionsCell = params => /*#__PURE__*/(0, _jsxRuntime.jsx)(GridActionsCell, (0, _extends2.default)({}, params));

exports.renderActionsCell = renderActionsCell;