const app = require(".");

const PORT = app.get("PORT");

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
