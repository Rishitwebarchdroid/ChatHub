const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Instance of Express Variable
const app = express();
dotenv.config();

connectDB();

app.use(express.json()); // To accept JSON data

app.get("/", (req, res) => {
  res.send("Running");
});

// User Routes
app.use("/api/user", userRoutes);

// Chat Routes
app.use("/api/chat", chatRoutes);

// Chat Routes
app.use("/api/message", messageRoutes);

// Error Handling Middleware
app.use(notFound); // if url not found
app.use(errorHandler); // any other error

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server Started on Port ${PORT}`.yellow.bold)
);

// Socket.io
// pingTimeout --> time it will wait while being inactive
// cors--> so that we dont have cross origin errors
const io = require("socket.io")(server, {
  pingTimeout: 6000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(" connected to socket.io");

  // User Should be connected to his own personal socket
  // It will take user data from frontend
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  // For User to join a room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joind room :" + room);
  });

  // For User Typing Indicator
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // For User to join a room
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) {
      return console.log("chat.user not defined");
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageReceived); // in --> inside user's room
    });
  });

  // Cleen Up the socket after user is disconnected
  socket.off("setup", () => {
    console.log("User Dissconnected");
    socket.leave(userData._id);
  });
});
