import * as React from "react";
import {
  DataGrid,
  getGridStringOperators,
  GridCellParams,
  gridClasses,
  GridColDef,
} from "@mui/x-data-grid";
import {
  Box,
  styled,
  useMediaQuery,
  Theme,
  IconButton,
  useTheme,
  Button,
} from "@mui/material";
import Iconify from "../Iconify/Iconify";

export interface headerOptions {
  xs?: string[];
  sm?: string[];
  md?: string[];
  lg?: string[];
  xl?: string[];
}

export default function DataTable({
  data = [],
  header = [],
  hidedColumns = [],
  newFunction = () => {},
  editFunction = (data: any) => {},
  deleteFunction = (data: any) => {},
  removeCheckBox = false,
  entity,
}: {
  isDetalhesTable?: boolean;
  data: any;
  header: GridColDef[];
  hidedColumns: headerOptions[];
  newFunction: () => any;
  editFunction: (data: any) => any;
  deleteFunction?: (data: any) => any;
  removeCheckBox?: boolean;
  entity: "Machine" | "Monitoring Points";
}) {
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const isLg = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  const theme = useTheme();

  const columns: GridColDef[] = React.useMemo(() => {
    let baseColumns: GridColDef[] = header.map((value) => {
      return {
        field: value.field,
        headerName: value.headerName,
        width: value.width,
        editable: false,
        headerStyle: { fontWeight: "bold" },
        filterOperators: getGridStringOperators().filter(
          (operator) =>
            operator.value === "equals" ||
            operator.value === "startsWith" ||
            operator.value === "endsWith" ||
            operator.value === "contains"
        ),
      };
    });
    baseColumns.unshift({
      field: "actions",
      headerName: "Actions",
      width: isXs
        ? 100
        : isSm
        ? 200
        : isMd
        ? entity == "Monitoring Points"
          ? 100
          : 185
        : isLg
        ? entity == "Monitoring Points"
          ? 150
          : 200
        : entity == "Monitoring Points"
        ? 150
        : 350,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            onClick={() => {
              editFunction(params);
            }}
          >
            <Iconify
              color={theme.palette.primary.main}
              icon={"material-symbols:edit"}
            />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => {
              deleteFunction(params);
            }}
          >
            <Iconify
              color={theme.palette.error.main}
              icon={"material-symbols:delete-outline"}
            />
          </IconButton>
        </>
      ),
    });

    const responsiveHidedColumns = () => {
      const breakpoint = isXs
        ? "xs"
        : isSm
        ? "sm"
        : isMd
        ? "md"
        : isLg
        ? "lg"
        : "xl";
      hidedColumns.forEach((columns) => {
        columns[breakpoint]?.forEach((column) => {
          baseColumns = baseColumns.filter((col) => col.field !== column);
        });
      });
    };

    responsiveHidedColumns();

    return baseColumns;
  }, [isXs, isSm, isMd, isLg, header, hidedColumns]);

  return (
    <Box
      borderRadius={2}
      key={JSON.stringify(data)}
      sx={{
        mb: 2,
        width: isXs ? (entity == "Machine" ? "100%" : "50%") : "100%",
        maxWidth: isXs ? (entity == "Machine" ? "90%" : "35%") : "95%",
        ml: { xs: 10, sm: 0 },
      }}
    >
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2, textTransform: "capitalize " }}
        onClick={() => newFunction()}
        startIcon={
          <Iconify
            color={theme.palette.primary.lighter}
            icon={"material-symbols:add-circle"}
          />
        }
      >
        New {entity}
      </Button>

      <Box
        sx={{
          height: {
            xl: "38.8dvh",
            lg: "40dvh",
            md: "27dvh",
            sm: "32dvh",
            xs: "40dvh",
          },
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          boxShadow: 4,
        }}
      >
        <StyledDataGrid
          rows={data && data}
          disableRowSelectionOnClick
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection={!removeCheckBox}
          disableMultipleRowSelection
          disableAutosize
          disableColumnResize
          sx={{
            overflowY: "hidden",
            boxShadow: 4,
            border: "none",
            " .MuiDataGrid-row--borderBottom .MuiDataGrid-filler": {
              borderBottom: "2px solid" + theme.palette.primary.main,
            },
            "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
              {
                display: "none",
              },
            "& .css-1woz1td-MuiButtonBase-root-MuiCheckbox-root.Mui-checked, .css-1woz1td-MuiButtonBase-root-MuiCheckbox-root.MuiCheckbox-indeterminate":
              {
                color: "black",
              },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "1px solid" + theme.palette.primary.main,
            },
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              backgroundColor: theme.palette.primary.main,
              color: "white",
            },
            "& .MuiSvgIcon-root.MuiSvgIcon-fontSizeSmall.MuiDataGrid-sortIcon":
              {
                color: "white",
              },
            "& .MuiDataGrid-menuIcon": {
              bgcolor: theme.palette.primary.main,
            },
            "& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader--sortable": {
              background: theme.palette.primary.main + "!important",
              outline: "none",
            },
            "& .css-k4uk3-MuiDataGrid-root .MuiDataGrid-columnHeader:not(.MuiDataGrid-columnHeader--sorted):hover .MuiDataGrid-sortIcon":
              {
                color: "white",
                opacity: 1,
              },
            "& .css-1woz1td-MuiButtonBase-root-MuiCheckbox-root": {
              opacity: 1,
            },
            "& .MuiDataGrid-columnHeaderTitleContainer:click": {
              outline: `solid ${theme.palette.primary.main} 1px`,
            },
            "--DataGrid-containerBackground": theme.palette.primary.main,

            "& .MuiButtonBase-root-MuiCheckbox-root": {
              color: "red",
            },
          }}
        />
      </Box>
    </Box>
  );
}

const StyledDataGrid = styled(DataGrid)({
  [`& .${gridClasses["scrollbar"]}`]: {
    overflow: "auto",
  },
  [`& .${gridClasses["selectedRowCount"]}`]: {
    color: "white",
  },
  [`& .${gridClasses.columnHeaders}`]: {
    backgroundColor: "black",
    borderBottom: "none",
  },
  [`& .${gridClasses.columnSeparator}`]: {
    display: "none",
  },
  [`& .${gridClasses.iconSeparator}`]: {
    display: "none",
  },
  [`& .${gridClasses.root}`]: {
    overflow: "auto",
    border: "none",
  },
  [`& .${gridClasses.row}`]: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "transparent !important",
    },
  },
  [`& .${gridClasses.row}.Mui-selected`]: {
    backgroundColor: "transparent !important",
    border: "none !important",
  },
  [`& .${gridClasses.columnHeader}`]: {
    border: "none !important",
  },
  [`& .${gridClasses.columnHeader}:focus`]: {
    outline: "none !important",
  },
  [`& .${gridClasses.columnHeader}:focus-visible`]: {
    outline: "none !important",
  },
  [`& .MuiMenuItem-root`]: {
    border: "none !important",
  },
  [`& .MuiMenuItem-root:hover`]: {
    backgroundColor: "transparent !important",
  },
  "&  .MuiDataGrid-cell:focus": {
    outline: "solid #274375 1px",
  },
  "& .css-1woz1td-MuiButtonBase-root-MuiCheckbox-root": {
    color: "black",
  },
});
