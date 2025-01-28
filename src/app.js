const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const app = express(); // Instance of an express.js application

app.use(express.json());

app.post("/sign-up", async (req, res) => {
  const user = new User({ ...req.body });

  try {
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

connectDb()
  .then(() => {
    console.log("Successfully connected to the DB");
    app.listen(3000, () => {
      console.log("app started on port 3000");
    });
  })
  .catch((err) => {
    console.error("Could not connect to the DB");
  });
