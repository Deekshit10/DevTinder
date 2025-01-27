const express = require("express");

const jwt = require("jsonwebtoken");

const connectdb = require("./config/database.js");

const cookieParser = require("cookie-parser");

const { userAuth } = require("./middlewares/auth.js");

const app = express();

app.use(express.json());

app.use(cookieParser());

const authRouter = require("../src/routes/auth.js");

const profileRouter = require("../src/routes/profile.js");

const requestRouter = require("../src/routes/request.js");

const userRouter = require("../src/routes/user.js");

app.use("/", authRouter);

app.use("/", profileRouter);

app.use("/", requestRouter);

app.use("/", userRouter);

connectdb()
  .then(() => {
    app.listen(3000, () => {});
  })
  .catch((err) => {
    console.log(err);
  });
