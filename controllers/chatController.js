import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    console.log("UsreId param not sent with request");
    return res.status(400);
  }

  // console.log(req.user._id)
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: req.user._id } }, // this is the current user
      },
      {
        users: { $elemMatch: { $eq: userId } }, // this id  of the user with who  he want start chatting
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
//console.log(isChat,'chat')
     
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
//console.log(isChat,'isChat')
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      ChatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
});

const getChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
        console.log(results,'results')
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroup = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).send("More than 2 users are required to form a group");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      ChatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, ChatName } = req.body;
  const updatedName = await Chat.findByIdAndUpdate(
    chatId,
    {
      ChatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedName) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedName);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const remove = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!remove) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(remove);
  }
});
export {
  accessChat,
  getChat,
  createGroup,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
