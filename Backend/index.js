require("dotenv").config();
const express = require("express");
const http = require("http"); // ✅ MUST
const cors = require("cors");
const { Server } = require("socket.io");

const dbConnection = require("./config/dbConnection");
const routes = require("./route");

const app = express();
const PORT = 3000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DB =================
dbConnection();

// ================= ROUTES =================
app.use(routes);

// ================= HTTP SERVER =================
const server = http.createServer(app); // ✅ FIX

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// 🔥 SOCKET ROOM SYSTEM
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log("👤 Joined room:", roomId);
  });

  // 🔥 AGENT LOCATION UPDATE
  socket.on("agent-location", ({ parcelId, lat, lng }) => {
    console.log("📍 Agent location:", lat, lng);

    // customer + admin receive
    io.emit("live-location", {
      parcelId,
      lat,
      lng,
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// 🔥 io globally available
app.set("io", io);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Server + Socket.IO running");
});

// ================= START SERVER =================
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
