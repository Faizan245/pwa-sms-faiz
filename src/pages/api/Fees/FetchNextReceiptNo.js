import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'GET') {
        const fetchSql = `SELECT MAX("Receipt_No") as maxReceiptNo FROM FeesReceipts`;
        db.get(fetchSql, [], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const nextReceiptNo = row.maxReceiptNo ? row.maxReceiptNo + 1 : 1;
            res.status(200).json({ nextReceiptNo });
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// curl -X GET "http://localhost:3000/api/Fees/FetchNextReceiptNo"
// response - "nextReceiptNo": 3