const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_DATA_SAFE = "firstName lastName age gender skills about photoUrl";
//Get all the pending connection requests for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA_SAFE);

    res.json({ data: pendingRequests });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all the connections for the logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_DATA_SAFE)
      .populate("toUserId", USER_DATA_SAFE);

    const data = connections.map((item) => {
      return item.fromUserId._id.toString() !== loggedInUser._id.toString()
        ? item.fromUserId
        : item.toUserId;
    });

    res.json({ data: data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const connectionData = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    hideUsersFromFeed.add(loggedInUser._id.toString());
    if (connectionData) {
      connectionData.forEach((item) => {
        hideUsersFromFeed.add(item.toUserId.toString());
        hideUsersFromFeed.add(item.fromUserId.toString());
      });
    }

    const userFeed = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(USER_DATA_SAFE)
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ data: userFeed, meta: { page: page } });
  } catch (err) {
    console.log(err);

    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
