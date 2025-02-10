import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'POST') {
        const {
            studentFeesID,
            scholarNo,
            studentName,
            familyID,
            totalFees,
            discount,
            deposited,
            remaining
        } = req.body;

        if (!studentFeesID || !scholarNo || !studentName || totalFees === undefined || discount === undefined || deposited === undefined || remaining === undefined) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }

        const upsertSql = `
            INSERT INTO FeesDetail (
                "StudentFeesID",
                "Scholar_No",
                "Student_Name",
                "Family_ID",
                "Total_Fees",
                "Discount",
                "Deposited",
                "Remaining"
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(StudentFeesID) DO UPDATE SET
                "Scholar_No" = excluded.Scholar_No,
                "Student_Name" = excluded.Student_Name,
                "Total_Fees" = excluded.Total_Fees,
                "Discount" = excluded.Discount,
                "Deposited" = excluded.Deposited,
                "Remaining" = excluded.Remaining
                ${familyID !== undefined ? ', "Family_ID" = excluded.Family_ID' : ''}
        `;
        const params = [studentFeesID, scholarNo, studentName, familyID, totalFees, discount, deposited, remaining];

        db.run(upsertSql, params, function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: "Fees detail inserted/updated successfully" });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// curl -X POST "http://localhost:3000/api/Fees/InsertOrUpdateFeesDetail" \
// -H "Content-Type: application/json" \
// -d '{
//     "studentFeesID": "year_23_24_Nur_1020",
//     "scholarNo": "1020",
//     "studentName": "Dravit Gurjar",
//     "totalFees": 9100,
//     "discount": 0,
//     "deposited": 2000,
//     "remaining": 7100
// }'