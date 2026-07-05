const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.resolve('database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) { console.error(err); process.exit(1); }
  db.all("SELECT sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", [], (e, r) => {
    r.forEach(t => console.log(t.sql + '\n'));
    db.close();
  });
});
