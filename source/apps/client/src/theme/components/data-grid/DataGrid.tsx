import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const DataGrid: Components<Omit<Theme, 'components'>>['MuiDataGrid'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      border: 'none',
      borderRadius: '0 !important',
      '--DataGrid-rowBorderColor': theme.palette.neutral.lighter,
      '&:hover, &:focus': {
        '*::-webkit-scrollbar, *::-webkit-scrollbar-thumb': {
          visibility: 'visible',
        },
      },
      '& .MuiDataGrid-scrollbar--vertical': {
        visibility: 'hidden',
      },
      '& .MuiDataGrid-scrollbarFiller': {
        minWidth: 0,
      },
    }),
    row: {
      '&:hover': { backgroundColor: 'transparent' },
    },
    cell: ({ theme }) => ({
      padding: 0,
      color: theme.palette.primary.darker,
      fontSize: theme.typography.body2.fontSize,
      fontWeight: 600,
      '&:focus-within': {
        outline: 'none !important',
      },
    }),
    cellCheckbox: {
      justifyContent: 'flex-end',
    },
    columnHeaderCheckbox: {
      '& .MuiDataGrid-columnHeaderTitleContainer': {
        justifyContent: 'flex-end',
      },
    },
    columnHeader: ({ theme }) => ({
      padding: 0,
      borderBottom: 1,
      borderColor: `${theme.palette.neutral.main} !important`,
      height: '3rem !important',
      '&:focus-within': {
        outline: 'none !important',
      },
    }),
    columnHeaderTitle: ({ theme }) => ({
      color: theme.palette.text.disabled,
      fontSize: theme.typography.body2.fontSize,
      fontWeight: 500,
    }),
    iconButtonContainer: () => ({
      '& .MuiIconButton-root': {
        backgroundColor: 'transparent !important',
        border: 'none',
      },
    }),
    columnSeparator: {
      display: 'none',
    },
    selectedRowCount: {
      display: 'none',
    },
    footerContainer: ({ theme }) => ({
      border: 0,
      borderTop: 1,
      borderStyle: 'solid',
      borderColor: `${theme.palette.neutral.main} !important`,
    }),
  },
};

export default DataGrid;
