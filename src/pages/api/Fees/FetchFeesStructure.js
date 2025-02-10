import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'GET') {
        const { Session } = req.query;
        
        if (!Session) {
            return res.status(400).json({ error: "Session is required" });
        }

        const fetchSql = `SELECT * FROM FeesStructure WHERE Session = ?`;
        db.get(fetchSql, [Session], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!row) {
                console.log(`No entry found for session: ${Session}`);
                return res.status(404).json({ error: "No entry found for this session" });
            }
            res.status(200).json(row);
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}