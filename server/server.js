const express = require("express");
const { config } = require("dotenv");
const { mongoose } = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const cors = require("cors");
const Content = require("./Models/ContentModel");

config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*", // Allow requests from this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

const PORT = process.env.PORT || 8000;

app.get("/api/cloudinary-sign", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },

    process.env.CLOUDINARY_SECRET
  );

  res.statusCode = 200;
  res.json({ signature, timestamp, api_key: process.env.CLOUDINARY_API_KEY });
});

app.post("/api/submit-content", async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, file, fileLink } = req.body;

    // Save content to the database
    const newContent = new Content({
      title,
      description,
      file,
      fileLink,
    });

    await newContent.save();
    console.log(newContent);
    res.status(201).json({ message: "Content submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

mongoose
  .connect(process.env.CONNECTION_URI, { dbName: "EDUCRAZE" })
  .then(() => {
    console.log("MONGO JUMBO");
  })
  .catch((err) => {
    console.error(`connection to db unsuccessful: ${err}`);
  });

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
