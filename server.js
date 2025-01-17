const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS package

// initialize express
const app = express();
const port = 3001;

// enable cors
app.use(cors());

// create server for socketio
const server = http.createServer(app);
const io = new Server(server);

// mysql database connection
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

// mongodb connection
mongoose
  .connect('mongodb://localhost:27017/testdb')
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// socketio steup
io.on('connection', socket => {
  console.log('A user connected');
  socket.on('message', msg => console.log(msg));
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// route to get jobs
app.get('/api/jobs', (req, res) => {
  db.query('SELECT * FROM jobs', (err, results) => {
    if (err) {
      res.status(500).send('Database error');
      return;
    }
    res.json(results);
  });
});

// route to get a single job
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

// route to add new job
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

// test route to check database conneciton
app.get('/testdb', (req, res) => {
  const sql = 'SELECT 1 + 1 AS solution';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(`Database connected: ${results[0].solution}`);
  });
});

// default
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// start server
server.listen(port, () => {
  console.log(`Server with Socket.io running at http://localhost:${port}`);
});
