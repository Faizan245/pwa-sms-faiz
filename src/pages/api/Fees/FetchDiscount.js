import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'GET') {
        const { studentFeesID } = req.query;

        if (!studentFeesID) {
            return res.status(400).json({ error: "StudentFeesID is required" });
        }

        const fetchSql = `SELECT Discount FROM FeesDetail WHERE StudentFeesID = ?`;
        db.get(fetchSql, [studentFeesID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!row) {
                return res.status(404).json({ error: "No entry found for the provided StudentFeesID" });
            }
            res.status(200).json({ discount: row.Discount });
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// curl -X GET "http://localhost:3000/api/Fees/FetchDiscount?studentFeesID=year_23_24_Nur_1020"