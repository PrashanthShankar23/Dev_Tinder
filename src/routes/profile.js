const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const profileRouter = express.Router();
const {
  validateProfileEditData,
  validatePasswordLoggedOutEdit,
  validatePasswordLoggedInEdit,
} = require("../utils/validator");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit request");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();
    res.json({
      message: `${user.firstName}, your profile was updated successfully`,
      data: user,
    });
  } catch (error) {
    res.status(400).send("Cannot update User: " + error.message);
  }
});

profileRouter.patch("/profile/password-loggedout", async (req, res) => {
  try {
    if (!validatePasswordLoggedOutEdit(req)) {
      throw new Error("Password change not allowed");
    }
    const { password } = req.body;
    const user = await User.findOne({ emailId: req.body.emailId });

    if (!user) {
      throw new Error("User does not exist, please sign up");
    }

    if (!validator.isStrongPassword(password)) {
      throw new Error("Please enter a strong password");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;

    await user.save();
    res.send("Password updated successfully, please login to continue");
  } catch (error) {
    res.status(400).send("Cannot update User: " + error.message);
  }
});

profileRouter.patch(
  "/profile/password-loggedin",
  userAuth,
  async (req, res) => {
    try {
      if (!validatePasswordLoggedInEdit) {
        throw new Error("Invalid request body");
      }
      const user = req.user;
      const { oldPassword, newPassword } = req.body;

      const isPasswordValid = await user.validatePassword(oldPassword);
      if (!isPasswordValid) {
        throw new Error("Incorrect credentials");
      }

      if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Please enter a strong password");
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.password = passwordHash;

      await user.save();
      res.send("Password updated successfully");
    } catch (error) {
      res.status(400).send("Cannot update Password: " + error.message);
    }
  }
);

module.exports = profileRouter;
