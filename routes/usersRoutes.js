const express = require('express');
const router = express.Router();
const db = require('./../db');
const bcrypt = require('bcryptjs');

// ✅ Login Endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid username or password' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Error comparing passwords' });
      if (!isMatch) return res.status(401).json({ error: 'Invalid username or password' });
      res.json({ message: 'Login successful', role: user.role });
    });
  });
});

// ✅ Register New User
router.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  if (!['mentee', 'mentor', 'admin'].includes(role)) {
    return res.status(400).json({ error: "Invalid role. Must be 'mentee', 'mentor', or 'admin'." });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });

    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, role], (err) => {
      if (err) return res.status(500).json({ error: 'Error registering user' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// ✅ Fetch all users (for right sidebar)
router.get('/users', (req, res) => {
  db.query('SELECT username, role FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

module.exports = router;
