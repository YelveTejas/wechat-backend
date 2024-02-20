import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../config/generateToken.js";
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all details" });
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: "User already Exist" });
  }

  const new_user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (new_user) {
    res.status(201).json({
      _id: new_user._id,
      name: new_user.name,
      email: new_user.email,
      pic: new_user.pic,
      token: generateToken(new_user.id),
    });
  } else {
    res.status(400).json({ message: "Failed to create new user" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ message: "Invalid Email or Passsword" });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search;

  const filter = keyword
    ? {
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find({ ...filter, _id: { $ne: req.user._id } });
  res.send(users);
});


export { registerUser, loginUser, getUsers };
