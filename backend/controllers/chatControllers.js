import asyncHandler from "express-async-handler";
import {Chat} from "../models/chatModel.js";
import {User} from "../models/userModel.js";

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});



//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
     // .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        // results = await User.populate(results, {
        //   path: "latestMessage.sender",
        //   select: "name pic email",
        // });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
    //  groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
     // .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
   // .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
   // .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    //.populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

export const fetchNotifications = asyncHandler(async (req, res) => {
  try {

const user = await User.findById(req.user._id).exec();
//console.log(user)
res.status(200).send(user.notification);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const addToNotifs = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    console.log("Invalid data passed into request");
    return res.status(400).send("Content is required");
  }

  try {
    // Ensure `req.user._id` is populated correctly. 
    // You might want to add validation for `req.user._id`.
    const userId = req.user._id;

    // Use `findByIdAndUpdate` correctly
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { notification: content } },
      { new: true } // This option returns the updated document
    ).exec();

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    // Send the updated notifications
    res.status(200).json(updatedUser.notification);
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).send("Server error");
  }
});

export const removeFromNotifs = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    console.log("Invalid data passed into request");
    return res.status(400).send("Content is required");
  }

  try {
    // Ensure `req.user._id` is populated correctly.
    // You might want to add validation for `req.user._id`.
    const userId = req.user._id;

    // Use `findByIdAndUpdate` correctly with `$pull` operator
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { notification: content } }, // Use `$pull` to remove the specified content
      { new: true } // This option returns the updated document
    ).exec();

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    // Send the updated notifications
    res.status(200).json(updatedUser.notification);
  } catch (error) {
    console.error("Error removing notifications:", error);
    res.status(500).send("Server error");
  }
});

export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};

