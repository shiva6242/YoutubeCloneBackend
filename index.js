const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const videoRoutes = require('./routes/videos');
const commentRoutes = require("./routes/comments");
const path = require('path');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8800;

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      throw err;
    });
};

// Middleware
const allowedOrigins = ['https://papaya-baklava-8b0fd2.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

const connectedUsers = {};

io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on('userDetails', (user) => {
    connectedUsers[socket.id] = user;
    io.emit('allUsers', connectedUsers);
  });

  socket.emit('yourID', socket.id);

  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('hey', { signal: data.signalData, from: data.from, name: data.name });
  });

  socket.on('acceptCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`);
    delete connectedUsers[socket.id];
    io.emit('allUsers', connectedUsers);
  });
});

// Start server
server.listen(PORT, () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
});
