const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

let username;
let userSockets = {};

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (_req, res) => {
  res.sendFile(join(__dirname, "./public/login.html"));
});

app.get("/chat", (_req, res) => {
  res.sendFile(join(__dirname, "./public/main.html"));
});
app.post("/login", (req, res) => {
  username = req.body.username;

  if (username) {
    userSockets[username] = null;
    res.redirect("/chat");
  }
});

io.on("connection", (socket) => {
  if (username && !userSockets[username]) {
    userSockets[username] = socket.id;
    io.emit("chat message", {
      message: `${username} has connected!`,
      sender: "server",
    });
  }
  socket.on("chat message", (msg) => {
    const messageWithSender = { message: msg, sender: socket.id };
    socket.broadcast.emit("chat message", messageWithSender);

    socket.emit("chat message", messageWithSender);
  });

  socket.on("disconnect", () => {
    if (username && userSockets[username] === socket.id) {
      userSockets[username] = null;

      const disconnectMessage = {
        message: `${username} has left that chat.`,
        sender: "server",
      };
      io.emit("chat message", disconnectMessage);
    }
  });
});

server.listen(3000, () => {
  console.log("server is running on localhost:3000");
});
