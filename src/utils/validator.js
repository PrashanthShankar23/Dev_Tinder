const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  }

  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateProfileEditData = (req) => {
  const allowedFields = [
    "photoUrl",
    "about",
    "firstName",
    "lastName",
    "emailId",
    "skills",
    "gender",
    "age",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) => {
    return allowedFields.includes(field);
  });

  return isEditAllowed;
};

const validatePasswordLoggedOutEdit = (req) => {
  const allowedFields = ["password", "emailId"];
  const isPasswordChangeAllowed = Object.keys(req.body).every((field) => {
    return allowedFields.includes(field);
  });

  return isPasswordChangeAllowed;
};

const validatePasswordLoggedInEdit = (req) => {
  const allowedFields = ["oldPassword", "newPassword"];
  const isPasswordChangeAllowed = Object.keys(req.body).every((field) => {
    return allowedFields.includes(field);
  });

  return isPasswordChangeAllowed;
};

module.exports = {
  validateSignUpData,
  validateProfileEditData,
  validatePasswordLoggedInEdit,
  validatePasswordLoggedOutEdit,
};
