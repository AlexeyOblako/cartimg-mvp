const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  db.all(
    `SELECT bookings.*, sessions.name AS session_name,
            sessions.date AS session_date, sessions.time AS session_time
     FROM bookings
     LEFT JOIN sessions ON bookings.session_id = sessions.id
     ORDER BY sessions.date DESC, sessions.time DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

router.get('/phone/:phone', (req, res) => {
  db.all(
    `SELECT bookings.id, bookings.session_id,
            sessions.date AS session_date, sessions.time AS session_time,
            bookings.karts_count, bookings.status, bookings.customer_name
     FROM bookings
     LEFT JOIN sessions ON bookings.session_id = sessions.id
     WHERE bookings.customer_phone = ?
     ORDER BY sessions.date DESC, sessions.time DESC`,
    [req.params.phone],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

router.get('/:id', (req, res) => {
  db.get(
    `SELECT bookings.*, sessions.name AS session_name,
            sessions.date AS session_date, sessions.time AS session_time
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
  const { session_id, customer_name, customer_phone, karts_count } = req.body;

  if (!session_id || !customer_name || !customer_phone || karts_count == null) {
    return res.status(400).json({
      error: 'Missing required fields: session_id, customer_name, customer_phone, karts_count',
    });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.get('SELECT * FROM sessions WHERE id = ?', [session_id], (err, session) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }

      if (!session) {
        db.run('ROLLBACK');
        return res.status(404).json({ error: 'Заезд не найден' });
      }

      if (session.available_karts < karts_count) {
        db.run('ROLLBACK');
        return res.status(400).json({
          error: `Нет свободных картов. Доступно: ${session.available_karts}, запрошено: ${karts_count}`,
        });
      }

      db.run(
        'INSERT INTO bookings (session_id, customer_name, customer_phone, karts_count) VALUES (?, ?, ?, ?)',
        [session_id, customer_name, customer_phone, karts_count],
        function (err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }

          const bookingId = this.lastID;

          db.run(
            'UPDATE sessions SET available_karts = available_karts - ? WHERE id = ?',
            [karts_count, session_id],
            function (err) {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
              }

              db.run('COMMIT');
              res.status(201).json({
                id: bookingId,
                session_id,
                customer_name,
                status: 'active',
                message: 'Бронь подтверждена',
              });
            }
          );
        }
      );
    });
  });
});

router.put('/:id', (req, res) => {
  const { session_id, customer_name, customer_phone, karts_count, status } = req.body;
  db.run(
    'UPDATE bookings SET session_id = ?, customer_name = ?, customer_phone = ?, karts_count = ?, status = ? WHERE id = ?',
    [session_id, customer_name, customer_phone, karts_count, status, req.params.id],
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
