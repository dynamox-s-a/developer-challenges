import { useEffect, useState } from "react";
import CardUserComponent from "./CardUserEvent";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import SortBar from "../sortBar/SortBar";

const CardUserList = ({
  events,
  searchTerm,
}: {
  events: Array<any>;
  searchTerm: string;
}) => {
  const [page, setPage] = useState(1);
  const [filteredEvents, setFilteredEvents] = useState<Array<any>>(events);
  const [sortedFutureEvents, setSortedFutureEvents] = useState<Array<any>>([]);
  const [sortedPastEvents, setSortedPastEvents] = useState<Array<any>>([]);
  const eventsPerPage = 12;
  const now = new Date();

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
    setPage(1);
  }, [searchTerm, events]);

  useEffect(() => {
    const future = filteredEvents
      .filter((event) => new Date(event.datetime) >= now)
      .sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      );

    const past = filteredEvents
      .filter((event) => new Date(event.datetime) < now)
      .sort(
        (a, b) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
      );

    setSortedFutureEvents(future);
    setSortedPastEvents(past);
  }, [filteredEvents]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const indexOfLastEvent = page * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;

  const currentFutureEvents = sortedFutureEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const currentPastEvents = sortedPastEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const sortByName = () => {
    const sortedFuture = [...sortedFutureEvents].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedPast = [...sortedPastEvents].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setSortedFutureEvents(sortedFuture);
    setSortedPastEvents(sortedPast);
  };

  const sortByDate = () => {
    const sortedFuture = [...sortedFutureEvents].sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
    const sortedPast = [...sortedPastEvents].sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
    setSortedFutureEvents(sortedFuture);
    setSortedPastEvents(sortedPast);
  };

  const totalPages = Math.max(
    Math.ceil(sortedFutureEvents.length / eventsPerPage),
    Math.ceil(sortedPastEvents.length / eventsPerPage)
  );

  return (
    <Box
      sx={{
        maxWidth: 1080,
        mx: "auto",
        padding: 2,
        overflowY: "auto",
      }}
    >
      <div>
        <h4
          style={{
            color: "white",
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          PRÓXIMOS EVENTOS
        </h4>

        <SortBar sortByName={sortByName} sortByDate={sortByDate} />

        <Grid container spacing={2} justifyContent={"center"}>
          {currentFutureEvents.length > 0 ? (
            currentFutureEvents.map((event) => (
              <Grid item xs={12} sm={6} md={3} key={event.id}>
                <CardUserComponent event={event} />
              </Grid>
            ))
          ) : (
            <p style={{ color: "white" }}>Nenhum evento futuro encontrado.</p>
          )}
        </Grid>
      </div>

      <div style={{ marginTop: "48px" }}>
        <h4 style={{ color: "white", textAlign: "center" }}>
          EVENTOS PASSADOS
        </h4>
        <Grid container spacing={2} justifyContent={"center"}>
          {currentPastEvents.length > 0 ? (
            currentPastEvents.map((event) => (
              <Grid item xs={12} sm={6} md={3} key={event.id}>
                <CardUserComponent event={event} />
              </Grid>
            ))
          ) : (
            <p style={{ color: "white" }}>Nenhum evento passado encontrado.</p>
          )}
        </Grid>
      </div>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{
            marginTop: 3,
            display: "flex",
            justifyContent: "center",
          }}
        />
      )}
    </Box>
  );
};

export default CardUserList;
