const mongoose = require("mongoose");

const User = require("../model/user");

const connectionRequest = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "intrested", "accepted", "rejected"],
        message: `{VALUE} is invalid`,
      },
    },
  },
  { timeStamp: true }
);

connectionRequest.pre("save", function (next) {
  const connection = this;
  if (connection.fromUserId.equals(connection.toUserId)) {
    throw new Error("You cannot send request to you");
  }
  next();
});

const Connection = mongoose.model("connection", connectionRequest);

module.exports = Connection;
