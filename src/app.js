const express = require("express");
const { connectDb } = require("./config/database");
const app = express(); // Instance of an express.js application
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json({ limit: "10mb" })); // we use this because we want to parse all request to json
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDb()
  .then(() => {
    console.log("Successfully connected to the DB");
    app.listen(7777, () => {
      console.log("app started on port 7777");
    });
  })
  .catch((err) => {
    console.error("Could not connect to the DB", err.message);
  });
