const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the database file
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database opening error:', err);
  } else {
    console.log('Database connected.');
  }
});

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error fetching table names:', err);
      db.close();
      return;
    }

    if (tables.length === 0) {
      console.log('No tables found in the database.');
      db.close();
      return;
    }

    tables.forEach((table, index) => {
      db.run(`DROP TABLE IF EXISTS ${table.name}`, (err) => {
        if (err) {
          console.error(`Error dropping table ${table.name}:`, err);
        } else {
          console.log(`Table ${table.name} dropped.`);
        }
        if (index === tables.length - 1) {
          db.close(() => {
            console.log('All tables have been dropped. Database connection closed.');
          });
        }
      });
    });
  });
});
