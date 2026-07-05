const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  const { phone } = req.query;
  let sql = `
    SELECT bookings.*, sessions.name AS session_name
    FROM bookings
    LEFT JOIN sessions ON bookings.session_id = sessions.id
  `;
  const params = [];

  if (phone) {
    sql += ' WHERE bookings.customer_phone = ?';
    params.push(phone);
  }

  sql += ' ORDER BY bookings.created_at DESC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get(
    `SELECT bookings.*, sessions.name AS session_name
     FROM bookings
     LEFT JOIN sessions ON bookings.session_id = sessions.id
     WHERE bookings.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Booking not found' });
      res.json(row);
    }
  );
});

router.post('/', (req, res) => {
  const { session_id, customer_name, customer_phone, participants, booking_date, booking_time } = req.body;
  if (!session_id || !customer_name || !customer_phone || !participants || !booking_date || !booking_time) {
    return res.status(400).json({ error: 'Missing required fields: session_id, customer_name, customer_phone, participants, booking_date, booking_time' });
  }
  db.run(
    'INSERT INTO bookings (session_id, customer_name, customer_phone, participants, booking_date, booking_time) VALUES (?, ?, ?, ?, ?, ?)',
    [session_id, customer_name, customer_phone, participants, booking_date, booking_time],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

router.put('/:id', (req, res) => {
  const { session_id, customer_name, customer_phone, participants, booking_date, booking_time, status } = req.body;
  db.run(
    'UPDATE bookings SET session_id = ?, customer_name = ?, customer_phone = ?, participants = ?, booking_date = ?, booking_time = ?, status = ? WHERE id = ?',
    [session_id, customer_name, customer_phone, participants, booking_date, booking_time, status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Booking not found' });
      res.json({ updated: this.changes });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM bookings WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
