const express = require("express");

const app = express(); // Instance of an express.js application

app.use("/", (req, res) => {
  res.send("Hello from the server");
});

app.listen(3000, () => {
  console.log("app started on port 3000");
});
