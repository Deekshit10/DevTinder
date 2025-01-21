const express = require("express");

const validator = require("validator");

const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");

const { validateEditData } = require("../utils/validate");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  const user = req.user;
  try {
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: Something went wrong " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const isValidEdit = validateEditData(req);
    if (!isValidEdit) {
      throw new Error("data is not valid");
    }
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} data is succesfully edited`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const validatePassword = validator.isStrongPassword(req.body.password);
    if (!validatePassword) {
      throw new Error("Password is not valid");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const loggedInUser = req.user;
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.json({ message: `password of ${loggedInUser.firstName} changed` });
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
});

module.exports = profileRouter;
