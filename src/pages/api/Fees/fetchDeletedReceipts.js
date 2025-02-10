import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'GET') {
        console.log("Fetching all deleted receipts");
        const fetchDeletedReceiptsSql = `SELECT * FROM DeletedReceipts`;
        db.all(fetchDeletedReceiptsSql, [], (err, receipts) => {
            if (err) {
                console.error("Error fetching deleted receipts:", err.message);
                return res.status(500).json({ error: err.message });
            }

            if (receipts.length === 0) {
                return res.status(200).json([]);
            }

            const fetchStudentNameSql = `SELECT Student_Name FROM admissions WHERE Scholar_No = ?`;
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
                    console.log("Fetched deleted receipts with student names:", results);
                    res.status(200).json(results);
                })
                .catch(error => {
                    console.error("Error fetching student names:", error.message);
                    res.status(500).json({ error: error.message });
                });
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// curl -X GET "http://localhost:3000/api/Fees/fetchDeletedReceipts"