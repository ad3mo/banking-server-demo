const express = require("express");
const cors = require("cors");
require("dotenv").config();
// sequelize database connection
const sequelize = require("./config/db");
//routes
const appRouter = require("./api/routes/index");

const app = express();
const PORT = 5000;
//middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api", appRouter);

// start server after db connection
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Start server
startServer();

module.exports = app;
