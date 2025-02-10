import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'GET') {
        const { Session, Class } = req.query;

        if (!Session || !Class) {
            return res.status(400).json({ error: "Session and Class are required" });
        }

        const columnName = `Total_Fees_${Class}`;
        const fetchSql = `SELECT ${columnName} FROM FeesStructure WHERE Session = ?`;
        db.get(fetchSql, [Session], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!row) {
                return res.status(404).json({ error: "No entry found for this session and class" });
            }
            res.status(200).json({ totalFees: row[columnName] });
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// curl -X GET "http://localhost:3000/api/Fees/FetchTotalFees?Session=year_23_24&Class=Nur"