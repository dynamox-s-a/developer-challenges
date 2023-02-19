/// <reference types="react" />
import { TextFieldProps } from '@mui/material/TextField';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
export declare type GridFilterInputSingleSelectProps = GridFilterInputValueProps & TextFieldProps & {
    type?: 'singleSelect';
};
declare function GridFilterInputSingleSelect(props: GridFilterInputSingleSelectProps): JSX.Element;
declare namespace GridFilterInputSingleSelect {
    var propTypes: any;
}
export { GridFilterInputSingleSelect };
