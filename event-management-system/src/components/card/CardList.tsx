import { useState } from "react";
import CardComponent from "./Card";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";

const CardList = ({ events }: { events: Array<any> }) => {
  const [page, setPage] = useState(1);
  const eventsPerPage = 12;

  const now = new Date();

  const futureEvents = events
    .filter((event) => new Date(event.datetime) >= now)
    .sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );

  const pastEvents = events
    .filter((event) => new Date(event.datetime) < now)
    .sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const indexOfLastEvent = page * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;

  const currentFutureEvents = futureEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const currentPastEvents = pastEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const totalPages = Math.max(
    Math.ceil(futureEvents.length / eventsPerPage),
    Math.ceil(pastEvents.length / eventsPerPage)
  );

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

      <h4 style={{ color: "white", marginTop: "32px", textAlign: "center" }}>
        PRÓXIMOS EVENTOS
      </h4>
      <Grid container spacing={2} justifyContent={"center"}>
        {currentFutureEvents.length > 0 ? (
          currentFutureEvents.map((event) => (
            <Grid item xs={12} sm={6} md={3} key={event.id}>
              <CardComponent event={event} />
            </Grid>
          ))
        ) : (
          <p style={{ color: "white" }}>Nenhum evento futuro encontrado.</p>
        )}
      </Grid>

      <h4 style={{ color: "white", marginTop: "48px", textAlign: "center" }}>
        EVENTOS PASSADOS
      </h4>
      <Grid container spacing={2} justifyContent={"center"}>
        {currentPastEvents.length > 0 ? (
          currentPastEvents.map((event) => (
            <Grid item xs={12} sm={6} md={3} key={event.id}>
              <CardComponent event={event} />
            </Grid>
          ))
        ) : (
          <p style={{ color: "white" }}>Nenhum evento passado encontrado.</p>
        )}
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
