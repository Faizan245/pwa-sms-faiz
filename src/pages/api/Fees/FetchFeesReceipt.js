import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'GET') {
        const { receiptId } = req.query;

        if (!receiptId) {
            return res.status(400).json({ error: "Receipt ID is required" });
        }

        const fetchSql = `
            SELECT fr.*, a.student_name 
            FROM FeesReceipts fr
            JOIN admissions a ON fr.Scholar_No = a.scholar_no
            WHERE fr.Receipt_ID = ?
        `;
        db.all(fetchSql, [receiptId], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (rows.length === 0) {
                return res.status(404).json({ message: `No receipt found for selected student` });
            }
            
            res.status(200).json(rows);
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// curl -X GET "http://localhost:3000/api/Fees/FetchFeesReceipt?receiptId=year_23_24_Nur_1020"