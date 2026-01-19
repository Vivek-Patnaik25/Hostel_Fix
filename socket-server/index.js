const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to the Next.js app URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on('status-update', (data) => {
    // Broadcast to hostel room and specific user
    io.to(`hostel-${data.hostelNo}`).emit('complaint-updated', data);
    if (data.userId) {
      io.to(`user-${data.userId}`).emit('complaint-updated', data);
    }
  });

  socket.on('new-complaint', (data) => {
    io.to(`staff-${data.category}`).emit('new-complaint', data);
    io.to(`admin`).emit('new-complaint', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
