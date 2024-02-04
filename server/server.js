const express = require("express");
const { config } = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const contentRouter = require("./routes/content");

config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

const PORT = process.env.PORT || 8000;

app.use("/api/content", contentRouter);

// Catch-all route for unknown queries
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server running on " + PORT);
});
