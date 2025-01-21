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

const validateEditData = (req) => {
  const { firstName, lastName, Gender, about, profileUrl, skills } = req.body;

  const allowedUpdates = [
    "firstName",
    "lastName",
    "Gender",
    "about",
    "profileUrl",
    "skills",
  ];
  const data = req.body;
  const isValidate = Object.keys(data).every((k) => allowedUpdates.includes(k));
  console.log(isValidate);
  return isValidate;
};

module.exports = {
  validateSignupdata,
  validateEditData,
};
