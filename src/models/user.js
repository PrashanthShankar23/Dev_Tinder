const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 1,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      lowerCase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address: ", value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password: ", value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowerCase: true,
      enum: {
        values: ["male", "female", "others"],
        message: `Gender is not supported`,
      },
    },
    photoUrl: {
      type: String,
      default: "https://www.geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL: ", value);
        }
      },
    },
    about: {
      type: String,
      default: "Hi! I'm here to connect with other devs",
    },
    skills: {
      type: [String],
      max: 3,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder_23", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
