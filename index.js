import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

io.on("connection", (socket) => {
  const ip = socket.handshake.address; // Отримання IP-адреси
  const userAgent = socket.handshake.headers["user-agent"]; // User-Agent
  const time = new Date(socket.handshake.time);
  console.log(time.toISOString(), "a user connected:", ip, userAgent);

  socket.on("chat message", (msg) => {
    //console.log(ip, "message: " + msg);
    io.emit("chat message", ip + " > " + msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", ip);
  });

  // Catch-all listeners
  socket.onAny((eventName, ...args) => {
    console.log("onAny:", eventName, " ", args);
  });

  socket.onAnyOutgoing((eventName, ...args) => {
    console.log("onAnyOutgoing:", eventName, " ", args);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

console.log("end programm");
