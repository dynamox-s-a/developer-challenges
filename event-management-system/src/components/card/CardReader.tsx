import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const CardReader = ({ event }: { event: any }) => {
  const eventDate = new Date(event.datetime);
  const formattedDate = `${eventDate.toLocaleDateString("pt-BR")} - ${eventDate
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    .replace(":", "h")}`;

  return (
    <Box sx={{ width: 300, height: 180, marginBottom: 2 }}>
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <CardContent sx={{ padding: "8px" }}>
          <Typography
            gutterBottom
            sx={{
              color: "primary.main",
              fontSize: 10,
              textTransform: "uppercase",
            }}
          >
            {event.category}
          </Typography>
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 12 }}
          >
            {event.location}
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: 14,
              fontWeight: "bold",
              color: "primary.main",
              textTransform: "uppercase",
            }}
          >
            {event.name}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 10 }}>
            {event.description}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 10 }}>
            {formattedDate}
          </Typography>
        </CardContent>
        <CardActions sx={{ padding: "8px" }}>
          <Button
            size="small"
            sx={{
              fontSize: 10,
              color: "primary.main",
              textTransform: "none",
              justifyContent: "flex-start",
              padding: 0,
              height: "24px",
              minWidth: "auto",
              backgroundColor: "transparent",
              textDecoration: "underline",
              "&:hover": {
                fontWeight: "bold",
                backgroundColor: "transparent",
              },
            }}
          >
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default CardReader;
