const express = require('express');
const router = express.Router();
const db = require('./../db');

// get jobs
router.get('/jobs', (req, res) => {
  const { claimed_by } = req.query;

  const query = 'SELECT * FROM jobs WHERE claimed_by = ?';
  db.query(query, [claimed_by], (err, results) => {
    if (err) return res.status(500).send('Database error');
    res.json(results);
  });
});


router.post("/jobs", (req, res) => {
  const { title, description, claimed_by } = req.body;

  if (!title || !description || !claimed_by) {
    return res.status(400).json({ error: "Title, description, and claimed_by are required." });
  }

  const query = "INSERT INTO jobs (title, description, claimed_by) VALUES (?, ?, ?)";
  db.query(query, [title, description, claimed_by], (err, result) => {
    if (err) {
      console.error("Failed to insert job:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({ id: result.insertId, title, description, claimed_by });
  });
});


// get tasks for a specific job
router.get('/tasks/:jobId', (req, res) => {
  const { jobId } = req.params;
  db.query('SELECT * FROM tasks WHERE job_id = ?', [jobId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// add new task to a job
router.post('/tasks', (req, res) => {
  const { job_id, description, created_by } = req.body;
  if (!job_id || !description || !created_by) {
    return res.status(400).json({ error: 'Job ID, description, and created_by are required.' });
  }

  const query = 'INSERT INTO tasks (job_id, description, created_by) VALUES (?, ?, ?)';
  db.query(query, [job_id, description, created_by], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ id: result.insertId, job_id, description, created_by });
  });
});

router.delete('/jobs/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM jobs WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

module.exports = router;