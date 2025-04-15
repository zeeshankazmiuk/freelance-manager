const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jobsRoutes = require('./routes/jobsRoutes.js');
const tasksRoutes = require('./routes/tasksRoutes');
const usersRoutes = require('./routes/usersRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const scrapeRoutes = require('./routes/scrapeRoutes');


// initialize express
const app = express();
const port = 3001;

// enable cors
// app.use(cors());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],      // temp disabling cors for debugging
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());






// create server for socketio
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});


// mongodb connection
mongoose
  .connect('mongodb://localhost:27017/testdb')
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// socketio setup
/*
io.on('connection', socket => {
  console.log('A user connected');
  socket.on('message', msg => console.log(msg));
  socket.on('disconnect', () => console.log('User disconnected'));
}); */

io.on('connection', socket => {
  console.log('A user connected');

  // koin a room
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);
  });

  // receive and broadcast a message
  socket.on('message', (msg) => {
    console.log(`New message in room ${msg.room}:`, msg);
    io.to(msg.room).emit('newMessage', msg);  // Broadcast to everyone in the room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// use the routes
//app.use('/api/jobs', jobsRoutes);     // GET /api/jobs, etc.
//app.use('/api/users', usersRoutes);   // POST /api/users/login, etc.
//app.use('/api/tasks', tasksRoutes);   // POST /api/tasks/create-task, etc.

app.use('/api', jobsRoutes);
//app.use('/api', tasksRoutes);
//app.use('/', tasksRoutes); 
app.use('/api', usersRoutes);
app.use('/api', tasksRoutes);
app.use('/api', messagesRoutes);
app.use('/api', scrapeRoutes);

app.use((req, res) => {

  res.status(404).json({ error: 'Route not found' });
});


/*app.all('*', (req, res) => {
  console.log(`❓ Unmatched Route Hit: ${req.method} ${req.originalUrl}`);
  res.status(404).send('Route not found');
});*/


// start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
