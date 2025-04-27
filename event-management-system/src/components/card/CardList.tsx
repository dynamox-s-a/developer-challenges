import { useState } from "react";
import CardComponent from "./Card";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";

const CardList = ({ events }: { events: Array<any> }) => {
  const [page, setPage] = useState(1);
  const eventsPerPage = 12;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const indexOfLastEvent = page * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(events.length / eventsPerPage);

  return (
    <Box
      sx={{
        maxWidth: 1080,
        mx: "auto",
        padding: 2,
        minHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <h1 style={{ color: "white", textAlign: "center" }}>EVENTOS</h1>
      <Grid container spacing={2}>
        {currentEvents.map((event) => (
          <Grid item xs={12} sm={6} md={3} key={event.id}>
            <CardComponent event={event} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ marginTop: 3, display: "flex", justifyContent: "center" }}
        />
      )}
    </Box>
  );
};

export default CardList;
