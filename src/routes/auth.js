const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignupdata } = require("../utils/validate.js");
const User = require("../model/user.js");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    validateSignupdata(req);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.send("new user data storeed in database");
  } catch (error) {
    res.status(400).send("something went wrong" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isvalidPassword = user.validatePassword(password);
    if (isvalidPassword) {
      const token = await user.getjwt();
      res.cookie("token", token);
      res.send("User login successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

authRouter.get("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout succesfully");
});

module.exports = authRouter;
