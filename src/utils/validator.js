const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  console.log(firstName, lastName);

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

module.exports = { validateSignUpData };
