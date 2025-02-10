import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const validClasses = ["Nur", "Kg1", "Kg2", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

export default (req, res) => {
    if (req.method === 'GET') {
        const { session, class: studentClass } = req.query;

        if (session && studentClass) {
            // Fetch students for a specific session and class
            const sql = `SELECT * FROM admissions WHERE ${session} = ?`;
            const params = [studentClass];

            db.all(sql, params, (err, rows) => {
                if (err) {
                    return res.status(500).json({ "error": err.message });
                }
                if (rows.length === 0) {
                    return res.status(404).json({ "error": "No records found for the given session and class" });
                }
                res.status(200).json(rows);
            });
        } else if (session) {
            // Fetch all students for a specific session
            const sql = `SELECT * FROM admissions WHERE ${session} IN (${validClasses.map(() => '?').join(', ')})`;
            const params = validClasses;

            db.all(sql, params, (err, rows) => {
                if (err) {
                    return res.status(500).json({ "error": err.message });
                }
                if (rows.length === 0) {
                    return res.status(404).json({ "error": "No records found for the given session" });
                }
                res.status(200).json(rows);
            });
        } else {
            // Fetch all students
            const sql = `SELECT * FROM admissions`;

            db.all(sql, [], (err, rows) => {
                if (err) {
                    return res.status(500).json({ "error": err.message });
                }
                if (rows.length === 0) {
                    return res.status(404).json({ "error": "No records found" });
                }
                res.status(200).json(rows);
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}