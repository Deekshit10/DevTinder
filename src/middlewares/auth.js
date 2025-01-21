const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      throw new Error("Token is not valid");
    }
    const decodedMessage = jwt.verify(token, "DEV@TINDER");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};
module.exports = {
  userAuth,
};
