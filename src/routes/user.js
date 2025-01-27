const express = require("express");

const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

const Connection = require("../model/connectionRequest");
const { connection } = require("mongoose");
const User = require("../model/user");

userRouter.get("/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await Connection.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({
      message: "list of pending connection",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loginuser = req.user;
    const connections = await Connection.find({
      $or: [
        {
          fromUserId: loginuser._id,
          status: "accepted",
        },
        { toUserId: loginuser._id },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loginuser._id.toString()) {
        return res.json({ data: row.toUserId });
      }
      return res.json({ data: row.fromUserId });
    });
  } catch (error) {
    res.send({ message: error.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = req.query.page || 1;

    const limit = req.query.limit || 10;

    const skip = (page - 1) * limit;

    const connectionRequest = await Connection.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");
    const hiddenUsers = new Set();
    connectionRequest.forEach((req) => {
      hiddenUsers.add(req.fromUserId);
      hiddenUsers.add(req.toUserId);
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName")
      .skip(skip)
      .limit(limit);
    console.log(users);
    res.send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
