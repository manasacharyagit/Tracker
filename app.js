const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  console.log(`User connected: ${socket.id}`); // Log when a user connects

  socket.on("send-location", function (data) {
    console.log(`Location received from ${socket.id}:`, data); // Log received location data
    io.emit("receive-location", { id: socket.id, ...data }); // Emit the location to all clients
  });

  socket.on("disconnect", function () {
    console.log(`User disconnected: ${socket.id}`); // Log when a user disconnects
    io.emit("user-disconnected", socket.id); // Notify all clients about the disconnection
  });
});

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000"); // Log server status
});
