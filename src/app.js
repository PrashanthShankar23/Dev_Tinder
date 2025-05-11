const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const app = express(); // Instance of an express.js application
const { validateSignUpData } = require("./utils/validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

app.use(express.json()); // we use this because we want to parse any request to json
app.use(cookieParser());

app.post("/sign-up", async (req, res) => {
  try {
    validateSignUpData(req);
    const { password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ ...req.body, password: passwordHash });
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() * 8 * 3600000),
      });
      res.send("Login Successful !");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (e) {
    res.status(400).send("LOGIN FAILED: " + e.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e.message);
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
