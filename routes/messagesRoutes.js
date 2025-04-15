const express = require('express');
const router = express.Router();
const db = require('../db');

// Get messages for a room
router.get('/messages/:room', (req, res) => {
  //const { room } = req.params;
  const encodedRoom = req.params.room;
  const room = decodeURIComponent(encodedRoom);

  const query = 'SELECT sender, content, timestamp FROM messages WHERE room = ? ORDER BY timestamp ASC';
  db.query(query, [room], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    console.log(`the past chats for room "${room}" are:`, results)
    res.json(results);
  });
});

// Post a new message
router.post('/postmessage', (req, res) => {
  const { room, sender, content } = req.body;
  const query = 'INSERT INTO messages (room, sender, content) VALUES (?, ?, ?)';
  db.query(query, [room, sender, content], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ id: result.insertId, room, sender, content });
  });
});

module.exports = router;
