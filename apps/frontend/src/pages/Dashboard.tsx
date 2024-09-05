import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Pagination,
  PaginationItem,
  Divider,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import MainLayout from "../components/MainLayout";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const cardsData = Array.from({ length: 10 }).map((_, index) => ({
  id: index + 1,
  title: `Dropbox`,
  description:
    "Dropbox is a file hosting service that offers cloud storage, file synchronization, a personal cloud.",
  updatedAt: "Mar 8, 2024",
  installs: Math.floor(Math.random() * 1000) + 400, // Number between 400 and 1400
}));

const DashboardPage = () => {
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedCards = cardsData.slice(
    (page - 1) * cardsPerPage,
    page * cardsPerPage
  );

  return (
    <MainLayout>
      <Helmet>
        <title>Gerenciamento de Maquinas</title>
      </Helmet>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Overview
        </Typography>

        <Grid container spacing={3}>
          {paginatedCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  borderRadius: "16px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  {/* Icon Placeholder */}
                  <Box
                    sx={{
                      height: "48px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    {/* Replace this with the actual icon/image */}
                    <img
                      src="https://www.dropbox.com/static/images/icons/favicon.ico"
                      alt="Icon"
                      style={{ height: "48px" }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{ mb: 1, fontWeight: "bold", color: "#1F2937" }}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
                    {card.description}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", color: "#9DA3A9" }}
                  >
                    <CalendarTodayIcon
                      sx={{ fontSize: 16, marginRight: 1 }}
                    />
                    Updated {card.updatedAt}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", color: "#9DA3A9" }}
                  >
                    <CloudDownloadIcon sx={{ fontSize: 16, marginRight: 1 }} />
                    {card.installs} installs
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(cardsData.length / cardsPerPage)}
            page={page}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#6366F1",
                    color: "white",
                  },
                }}
              />
            )}
          />
        </Box>
      </Box>
    </MainLayout>
  );
};

export default DashboardPage;
