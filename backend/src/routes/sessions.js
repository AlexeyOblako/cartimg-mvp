const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  db.all('SELECT * FROM sessions ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM sessions WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Session not found' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { name, description, price, duration_minutes, max_participants } = req.body;
  if (!name || price == null || !duration_minutes || !max_participants) {
    return res.status(400).json({ error: 'Missing required fields: name, price, duration_minutes, max_participants' });
  }
  db.run(
    'INSERT INTO sessions (name, description, price, duration_minutes, max_participants) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, duration_minutes, max_participants],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

router.put('/:id', (req, res) => {
  const { name, description, price, duration_minutes, max_participants } = req.body;
  db.run(
    'UPDATE sessions SET name = ?, description = ?, price = ?, duration_minutes = ?, max_participants = ? WHERE id = ?',
    [name, description, price, duration_minutes, max_participants, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Session not found' });
      res.json({ updated: this.changes });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM sessions WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Session not found' });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
