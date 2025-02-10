import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'GET') {
        const { session, class: studentClass } = req.query;

        if (!session) {
            return res.status(400).json({ error: "Session is required" });
        }

        let searchPattern = session;
        if (studentClass) {
            searchPattern += `_${studentClass}`;
        }

        const fetchSql = `
            SELECT 
                fd.*, 
                a.Contact_No, 
                a.WhatsApp_No 
            FROM 
                FeesDetail fd
            LEFT JOIN 
                admissions a 
            ON 
                fd.Scholar_No = a.Scholar_No
            WHERE 
                fd.StudentFeesID LIKE ?
        `;
        db.all(fetchSql, [`${searchPattern}%`], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (rows.length === 0) {
                return res.status(404).json({ error: "No entries found for the provided session and class" });
            }
            res.status(200).json({ feesDetails: rows });
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// curl -X GET "http://localhost:3000/api/Fees/FetchFeesDetail?session=year_23_24"
// curl -X GET "http://localhost:3000/api/Fees/FetchFeesDetail?session=year_23_24&class=Nur"