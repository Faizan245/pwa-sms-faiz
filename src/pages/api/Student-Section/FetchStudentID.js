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

        const fetchSql = `SELECT scholar_no, student_name FROM admissions WHERE ${Session} = ?`;
        db.all(fetchSql, [Class], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (rows.length === 0) {
                console.log(`No entry found for session: ${Session} and class: ${Class}`);
                return res.status(404).json({ error: "No entry found for this session and class" });
            }
            res.status(200).json({ students: rows });
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// curl -X GET "http://localhost:3000/api/Student-Section/FetchStudentID?Session=year_23_24&Class=1st"