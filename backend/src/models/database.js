const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '..', '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

function initDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        duration_minutes INTEGER NOT NULL,
        max_participants INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        participants INTEGER NOT NULL,
        status TEXT DEFAULT 'confirmed',
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      )
    `);

    db.get('SELECT COUNT(*) AS cnt FROM sessions', [], (err, row) => {
      if (err) {
        console.error('Seed check failed:', err.message);
        return;
      }
      if (row.cnt === 0) {
        const seeds = [
          ['Спринт 10 мин', 'Быстрый заезд для начинающих', 1500, 10, 8, '2026-07-10', '14:00'],
          ['Спринт 10 мин', 'Быстрый заезд для начинающих', 1500, 10, 8, '2026-07-10', '15:00'],
          ['Гонка 20 мин', 'Полноценная гонка для опытных', 2500, 20, 10, '2026-07-10', '16:00'],
          ['Драйв 30 мин', 'Для опытных пилотов', 3500, 30, 6, '2026-07-11', '14:00'],
          ['Супер-спринт 15 мин', 'Ускоренный формат', 2000, 15, 8, '2026-07-11', '15:00'],
        ];

        const stmt = db.prepare(
          'INSERT INTO sessions (name, description, price, duration_minutes, max_participants, date, time) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        for (const s of seeds) {
          stmt.run(s);
        }
        stmt.finalize();
        console.log('Seeded 5 test sessions');
      }
    });
  });
}

initDatabase();

module.exports = db;
