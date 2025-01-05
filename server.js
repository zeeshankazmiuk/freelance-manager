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
  password: 'Aksqlsk13', // Update this if needed
  database: 'freelance_jobs', // Update this to the name of your jobs database
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// MongoDB Connection - If you still need it for messages or other data, otherwise remove it
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

// Route to get all jobs
app.get('/api/jobs', (req, res) => {
  db.query('SELECT * FROM jobs', (err, results) => {
    if (err) {
      res.status(500).send('Database error');
      return;
    }
    res.json(results);
  });
});

// Route to get a single job by ID
app.get('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM jobs WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).send('Database error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Job not found');
    } else {
      res.json(results[0]);
    }
  });
});

// Route to add a new job
app.post('/api/jobs', (req, res) => {
  const { title, description, budget, skills, client_rating, posted_date } = req.body;
  const query = 'INSERT INTO jobs (title, description, budget, skills, client_rating, posted_date) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [title, description, budget, skills, client_rating, posted_date];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send('Database error');
      return;
    }
    res.status(201).json({ id: results.insertId });
  });
});

// Test route to check database connection (optional)
app.get('/testdb', (req, res) => {
  const sql = 'SELECT 1 + 1 AS solution';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(`Database connected: ${results[0].solution}`);
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the Server
server.listen(port, () => {
  console.log(`Server with Socket.io running at http://localhost:${port}`);
});
