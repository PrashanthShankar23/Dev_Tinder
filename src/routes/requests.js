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
      // if (status === "interested") {
      //   const toUserRequest = await ConnectionRequest.findOne({
      //     fromUserId: toUserId,
      //   });

      //   if (toUserRequest?.toUserId.toString() === fromUserId.toString()) {
      //     status = "accepted";
      //   }
      // }

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

module.exports = requestRouter;
