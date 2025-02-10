import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'GET') {
        const fetchSql = `SELECT * FROM deletedadmission`;

        db.all(fetchSql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (rows.length === 0) {
                return res.status(404).json({ error: "No records found" });
            }
            res.status(200).json(rows);
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}