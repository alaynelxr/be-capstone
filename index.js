const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000; // Choose a port for your backend

//routes
const categoriesRoute = require("./routes/categories");
const movesRoute = require("./routes/moves");
const listsRoute = require("./routes/lists");
const difficultiesRoute = require("./routes/difficulties");

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

// parse json
app.use(express.json());
// use cors for all routes
app.use(cors());

app.use("/categories", categoriesRoute);
app.use("/moves", movesRoute);
app.use("/lists", listsRoute);
app.use("/difficulty", difficultiesRoute);
