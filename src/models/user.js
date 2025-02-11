const mongoose = require("mongoose");
const validator = require("validator");

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
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Gender data is not valid");
        }
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

const User = mongoose.model("User", userSchema);

module.exports = User;
