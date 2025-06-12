const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId } = req.params;
      let { status } = req.params;

      if (["accepted", "rejected"].includes(status)) {
        throw new Error("Invalid status type");
      }

      const existingUser = await User.findById(toUserId);
      if (!existingUser) {
        throw new Error("Cannot send request to non-existent user");
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        throw new Error("Connection Request exists");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        data: data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status value");
      }

      const requestor = await User.findById(requestId);

      if (!requestor) {
        throw new Error("The user does not exist");
      }
      const existingRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
      });

      if (!existingRequest) {
        throw new Error("Connection Request does not exist");
      }

      const existingStatus = existingRequest.status;

      if (existingStatus === "ignored") {
        throw new Error(`${requestor.firstName} is not interested in you`);
      } else if (allowedStatus.includes(existingStatus)) {
        throw new Error(
          `You have already ${existingStatus} ${requestor.firstName}'s request`
        );
      }

      existingRequest.status = status;
      const data = await existingRequest.save();

      res.json({
        message: `You have ${status} ${requestor.firstName}'s request`,
        data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
