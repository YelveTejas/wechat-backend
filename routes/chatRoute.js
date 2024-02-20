import express from "express";
import { authentication } from "../middleware/Authmiddlerware.js";
import {
  accessChat,
  addToGroup,
  createGroup,
  getChat,
  removeFromGroup,
  renameGroupChat,
} from "../controllers/chatController.js";
const chatrouter = express.Router();

chatrouter.post("/", authentication, accessChat);
chatrouter.get("/", authentication, getChat);
chatrouter.post("/group", authentication, createGroup);
chatrouter.put("/rename", authentication, renameGroupChat);
chatrouter.put("/remove", authentication, removeFromGroup);
chatrouter.put("/add", authentication, addToGroup);

export default chatrouter;
