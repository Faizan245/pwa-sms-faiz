import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'GET') {
        const fetchSql = `SELECT * FROM FeesReceipts`;
        db.all(fetchSql, [], (err, receipts) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (receipts.length === 0) {
                return res.status(404).json({ error: "No receipts found" });
            }

            const fetchStudentNameSql = `SELECT student_name FROM admissions WHERE scholar_no = ?`;
            const promises = receipts.map(receipt => {
                return new Promise((resolve, reject) => {
                    db.get(fetchStudentNameSql, [receipt.Scholar_No], (err, row) => {
                        if (err) {
                            return reject(err);
                        }
                        receipt.student_name = row ? row.student_name : null;
                        resolve(receipt);
                    });
                });
            });

            Promise.all(promises)
                .then(results => {
                    res.status(200).json({ receipts: results });
                })
                .catch(error => {
                    res.status(500).json({ error: error.message });
                });
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// curl -X GET "http://localhost:3000/api/Fees/FetchAllFeesReceipts"