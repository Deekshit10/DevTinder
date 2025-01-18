const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 4,
    maxLength: 50,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("EmailId is not valid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Please enter strong password");
      }
    },
  },
  Gender: {
    type: String,
    validate(value) {
      if (!["Male", "Female", "others"].includes(value)) {
        throw new Error("Gender data is not valid");
      }
    },
  },
  age: {
    type: Number,
    min: 18,
  },
  profileUrl: {
    type: String,
    default: "https://commons.wikimedia.org/wiki/File:Default_pfp.jpg",
  },
  about: {
    type: String,
    default: "This is default about of user",
  },
  skills: {
    type: [String],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
