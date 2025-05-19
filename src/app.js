const express = require("express");
const { connectDb } = require("./config/database");
const app = express(); // Instance of an express.js application
const cookieParser = require("cookie-parser");

app.use(express.json()); // we use this because we want to parse any request to json
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDb()
  .then(() => {
    console.log("Successfully connected to the DB");
    app.listen(3000, () => {
      console.log("app started on port 3000");
    });
  })
  .catch((err) => {
    console.error("Could not connect to the DB", err.message);
  });
