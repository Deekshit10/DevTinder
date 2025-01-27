const express = require("express");

const mongoose = require("mongoose");

const { userAuth } = require("../middlewares/auth");

const User = require("../model/user");

const Connection = require("../model/connectionRequest");

const requestRouter = express.Router();

requestRouter.post(
  "/connection/request/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const fromUserId = loggedInUser._id;
      const status = req.params?.status;
      const toUserId = req.params?.toUserId;
      const allowedStatus = ["intrested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("status is not correct");
      }
      const reciever = await User.findById(toUserId);
      if (!reciever) {
        throw new Error("There is no user with this userid");
      }

      const existingConnection = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnection) {
        throw new Error("The connection already existed");
      }

      // const connectionRequest =
      const newConnection = new Connection({
        fromUserId,
        toUserId,
        status,
      });
      await newConnection.save();
      res.json({
        message:
          status === "intrested"
            ? `${loggedInUser.firstName} intrested in ${reciever.firstName}`
            : `${loggedInUser.firstName} ignored  ${reciever.firstName}`,
        data: newConnection,
      });
    } catch (error) {
      res.status(400).json({ Error: error.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    console.log("inside request router");
    try {
      const loggedInUser = req.user;
      const status = req.params?.status;
      const requestId = req.params?.requestId;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.json({ message: "status is not valid" });
      }
      const connectionRequest = await Connection.findOne({
        _id: requestId,
        toUserId: loggedInUser.id,
        status: "intrested",
      });
      if (!connectionRequest) {
        return res.send("Connection request is not valid");
      }
      connectionRequest.status = status;
      await connectionRequest.save();
      res.json({
        message: "connection request status changed",
        data: connectionRequest,
      });
    } catch (error) {
      res.status(400).send("Error " + error.message);
    }
  }
);

module.exports = requestRouter;
