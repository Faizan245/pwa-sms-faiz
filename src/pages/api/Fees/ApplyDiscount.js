import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'POST') {
        const { studentFeesID, discount, remaining } = req.body;

        if (!studentFeesID || discount === undefined || remaining === undefined) {
            return res.status(400).json({ error: "StudentFeesID, discount, and remaining are required" });
        }

        const checkSql = `SELECT 1 FROM FeesDetail WHERE StudentFeesID = ?`;
        db.get(checkSql, [studentFeesID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!row) {
                return res.status(404).json({ error: "StudentFeesID does not exist" });
            }

            const updateSql = `
                UPDATE FeesDetail
                SET 
                    Discount = ?,
                    Remaining = ?
                WHERE StudentFeesID = ?
            `;
            const params = [discount, remaining, studentFeesID];

            db.run(updateSql, params, function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(200).json({ message: "Fees details updated successfully" });
            });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// curl -X POST "http://localhost:3000/api/Fees/ApplyDiscount" \
// -H "Content-Type: application/json" \
// -d '{
//     "studentFeesID": "year_23_24_Nur_1020",
//     "discount": 500,
//     "remaining": 7100
// }'