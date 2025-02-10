import sqlite3 from 'sqlite3';
import path from 'path';
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
console.log('Database Path:', dbPath);  // Add this line

const db = new sqlite3.Database(dbPath);

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    console.log('Received credentials:', { username, password });

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Missing username or password' });
    }

    // Debug log for checking table presence
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='admin'", (err, rows) => {
      if (err) {
        console.error('Error checking table existence:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (rows.length === 0) {
        console.error('Admin table does not exist!');
        return res.status(500).json({ success: false, message: 'Admin table does not exist' });
      }

      console.log('Admin table exists, querying credentials...');

      db.get(
        'SELECT * FROM admin WHERE username = ? AND password = ?',
        [username, password],
        (err, row) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
          }

          if (row) {
            return res.status(200).json({ success: true, message: 'Login successful' });
          } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
          }
        }
      );
    });
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed bananana` });
  }
}
