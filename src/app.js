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

app.get("/user", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ emailId: email });

    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const id = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.status(200).send("User removed successfully" + " " + user);
    } else {
      res.status(200).send("User not found");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const ALLOWED_UPDATES = ["photoUrl", "gender", "age", "about", "skills"];

  try {
    const isUpdateAllowed = Object.keys(body).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });

    if (!isUpdateAllowed) {
      throw new Error("Update not Allowed");
    }

    await User.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).send("User updated successfully");
  } catch (e) {
    // console.log(e);

    res.status(400).send("UPDATE FAILED: " + e.message);
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
