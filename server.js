const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const mongoose = require('mongoose');

// Initialize Express App
const app = express();
const port = 3001;

// Create HTTP Server for Socket.io
const server = http.createServer(app);
const io = new Server(server);

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Aksqlsk13',
  database: 'testdb',
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/testdb')
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Socket.io Setup
io.on('connection', socket => {
  console.log('A user connected');
  socket.on('message', msg => console.log(msg));
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'This is a REST API route!' });
});

app.get('/api/job-leads', async (req, res) => {
  try {
    const jobLeads = await getJobLeads(); // Call the function to get leads
    res.json(jobLeads);
  } catch (err) {
    console.error('Error fetching job leads:', err);
    res.status(500).json({ error: 'Failed to fetch job leads' });
  }
});

app.get('/testdb', (req, res) => {
  const sql = 'SELECT 1 + 1 AS solution';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(`Database connected: ${results[0].solution}`);
  });
});

// Start the Server
server.listen(port, () => {
  console.log(`Server with Socket.io running at http://localhost:${port}`);
});
