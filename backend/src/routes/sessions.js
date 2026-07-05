const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  const sql = `
    SELECT s.*, s.max_participants - IFNULL(SUM(b.participants), 0) AS available_places
    FROM sessions s
    LEFT JOIN bookings b ON b.session_id = s.id AND b.status = 'confirmed'
    GROUP BY s.id
    ORDER BY s.date ASC, s.time ASC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  const sql = `
    SELECT s.*, s.max_participants - IFNULL(SUM(b.participants), 0) AS available_places
    FROM sessions s
    LEFT JOIN bookings b ON b.session_id = s.id AND b.status = 'confirmed'
    WHERE s.id = ?
    GROUP BY s.id
  `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Session not found' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { name, description, price, duration_minutes, max_participants, date, time } = req.body;
  if (!name || price == null || !duration_minutes || !max_participants || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields: name, price, duration_minutes, max_participants, date, time' });
  }
  db.run(
    'INSERT INTO sessions (name, description, price, duration_minutes, max_participants, date, time) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, duration_minutes, max_participants, date, time],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

router.put('/:id', (req, res) => {
  const { name, description, price, duration_minutes, max_participants, date, time } = req.body;
  db.run(
    'UPDATE sessions SET name = ?, description = ?, price = ?, duration_minutes = ?, max_participants = ?, date = ?, time = ? WHERE id = ?',
    [name, description, price, duration_minutes, max_participants, date, time, req.params.id],
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
