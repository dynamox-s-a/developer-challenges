import * as React from 'react';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
export interface GridFilterFormProps {
    /**
     * The [[GridFilterItem]] representing this form.
     */
    item: GridFilterItem;
    /**
     * If `true`, the logic operator field is rendered.
     * The field will be invisible if `showMultiFilterOperators` is also `true`.
     */
    hasMultipleFilters: boolean;
    /**
     * If `true`, the logic operator field is visible.
     */
    showMultiFilterOperators?: boolean;
    /**
     * The current logic operator applied.
     */
    multiFilterOperator?: GridLinkOperator;
    /**
     * If `true`, disables the logic operator field but still renders it.
     */
    disableMultiFilterOperator?: boolean;
    /**
     * A ref allowing to set imperative focus.
     * It can be passed to the el
     */
    focusElementRef?: React.Ref<any>;
    /**
     * Callback called when the operator, column field or value is changed.
     * @param {GridFilterItem} item The updated [[GridFilterItem]].
     */
    applyFilterChanges: (item: GridFilterItem) => void;
    /**
     * Callback called when the logic operator is changed.
     * @param {GridLinkOperator} operator The new logic operator.
     */
    applyMultiFilterOperatorChanges: (operator: GridLinkOperator) => void;
    /**
     * Callback called when the delete button is clicked.
     * @param {GridFilterItem} item The deleted [[GridFilterItem]].
     */
    deleteFilter: (item: GridFilterItem) => void;
    /**
     * Sets the available logic operators.
     * @default [GridLinkOperator.And, GridLinkOperator.Or]
     */
    linkOperators?: GridLinkOperator[];
    /**
     * Changes how the options in the columns selector should be ordered.
     * If not specified, the order is derived from the `columns` prop.
     */
    columnsSort?: 'asc' | 'desc';
    /**
     * Props passed to the delete icon.
     * @default {}
     */
    deleteIconProps?: any;
    /**
     * Props passed to the logic operator input component.
     * @default {}
     */
    linkOperatorInputProps?: any;
    /**
     * Props passed to the operator input component.
     * @default {}
     */
    operatorInputProps?: any;
    /**
     * Props passed to the column input component.
     * @default {}
     */
    columnInputProps?: any;
    /**
     * Props passed to the value input component.
     * @default {}
     */
    valueInputProps?: any;
    /**
     * @ignore - do not document.
     */
    children?: React.ReactNode;
}
declare const GridFilterForm: React.ForwardRefExoticComponent<GridFilterFormProps & React.RefAttributes<HTMLDivElement>>;
export { GridFilterForm };
