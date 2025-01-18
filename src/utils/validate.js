const validator = require("validator");

const validateSignupdata = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please provide valid name");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not valid");
  }
};

module.exports = {
  validateSignupdata,
};
