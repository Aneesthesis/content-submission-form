const express = require("express");
const User = require("./Models/userModel");
const { default: mongoose } = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const data = [
  { email: "anees@abc.com", password: "anees1223" },
  { email: "sana@abc.com", password: "sana1223" },
];

app.get("/api", (req, res) => {
  res.send("hello");
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // search for existing user in database

  const existingUser = data.find((el) => el.email === email);
  console.log(existingUser);
  if (existingUser) {
    if (existingUser.password === password) {
      res.send("user authenticated");
    } else {
      res.send("invalid credentials");
    }
  }
});

//mongoose.connect();

app.listen(8000, () => {
  console.log(`serving on localhost 8000`);
});
