import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');

export default function handler(req, res) {
    // Open database connection
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return res.status(500).json({ error: "Database connection failed" });
        }
    });

    if (req.method === 'GET') {
        const admissionYear = req.query.admission_year;

        if (admissionYear) {
            // Extract the year from the admission_date in dd/mm/yyyy format
            const sql = `SELECT * FROM admissions WHERE SUBSTR(admission_date, 7, 4) = ?`;
            db.all(sql, [admissionYear], (err, rows) => {
                if (err) {
                    db.close();
                    return res.status(500).json({ error: err.message });
                }
                db.close();
                if (rows.length === 0) {
                    return res.status(404).json({ error: "No records found for the given year" });
                }
                return res.status(200).json(rows);
            });
        } else {
            db.close();
            return res.status(400).json({ error: "Invalid query parameters" });
        }
    } else if (req.method === 'POST') {
        try {
            const { scholarNo } = req.body; // Ensure scholarNo is extracted correctly

            if (!scholarNo) {
                return res.status(400).json({ error: "Scholar number is required" });
            }

            const sql = `SELECT * FROM admissions WHERE scholar_no = ?`;
            db.get(sql, [scholarNo], (err, row) => {
                db.close();
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                if (!row) {
                    return res.status(404).json({ error: "Record not found" });
                }
                return res.status(200).json(row);
            });
        } catch (error) {
            db.close();
            return res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']); // Allow both GET and POST
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

// curl -X GET "http://localhost:3000/api/Admission/FetchAdmission?admission_year=2023"
// curl -X POST "http://localhost:3000/api/Admission/FetchAdmission" -H "Content-Type: application/json" -d '{"scholar_no": "12345"}'