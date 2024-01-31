import PropTypes from "prop-types";
import {
  Box,
  Card,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "./scrollbar";
import { default as NextLink } from "next/link";

export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    page = 0,
    rowsPerPage = 5,
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#E8E9EA" }}>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Monitoring Point
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Machine Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Machine Type</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Sensor</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((monitoringPoint) => {
                return (
                  <TableRow hover key={monitoringPoint.id}>
                    <TableCell>{monitoringPoint.name}</TableCell>
                    <TableCell>{monitoringPoint.machine.name}</TableCell>
                    <TableCell>{monitoringPoint.machine.type}</TableCell>
                    <TableCell>{monitoringPoint.sensor.model}</TableCell>
                    <TableCell>
                      <Link
                        component={NextLink}
                        href=""
                        underline="hover"
                        variant="subtitle2"
                      >
                        Editar
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={5}
      />
    </Card>
  );
};

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
