import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import router from "./routes/userRoutes.js";
import chatrouter from "./routes/chatRoute.js";
import ConnectDb from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { messagerouter } from "./routes/messageRoutes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/user", router);
app.use("/chat", chatrouter);
app.use("/message", messagerouter);
app.use(notFound);
app.use(errorHandler);

ConnectDb();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
//  console.log("Server Connected");
});

const io = new SocketIOServer(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000","https://chatspehre.netlify.app"]
  },
});

io.on("connection", (socket) => {
//  console.log("Connected to socket");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
  //  console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  //  console.log("User Joined Room", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
   // console.log(newMessageReceived,'new')
    var chat = newMessageReceived.chat;
    if (!chat.users) return // console.log("chat users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
