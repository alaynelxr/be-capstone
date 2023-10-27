const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000; // Choose a port for your backend

const admin = require("firebase-admin");
const serviceAccount = require("./config/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// module.exports = admin;

//routes
const categoriesRoute = require("./routes/categories");
const movesRoute = require("./routes/moves");
const listsRoute = require("./routes/lists");
const usersRoute = require("./routes/users");

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

const allowedOrigins = ["http://localhost:3000"]; // Add all the domains you want to allow
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request's origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,PUT,POST,DELETE, PATCH",
  credentials: true, // This option is important if you're dealing with cookies or authentication.
};

// parse json
app.use(express.json());
// use cors for all routes
app.use(cors(corsOptions));

app.use("/categories", categoriesRoute);
app.use("/moves", movesRoute);
app.use("/lists", listsRoute);
app.use("/users", usersRoute);
