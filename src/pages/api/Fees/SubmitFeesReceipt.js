import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'POST') {
        const {
            receiptId,
            receiptNo,
            date,
            scholarNo,
            class: studentClass,
            session,
            description,
            modeOfPay,
            totalAmt,
            amtInWords
        } = req.body;

        if (!receiptId || !receiptNo || !date || !scholarNo || !studentClass || !session || !modeOfPay || !totalAmt || !amtInWords) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }

        const insertSql = `
            INSERT INTO FeesReceipts (
                "Receipt_ID",
                "Receipt_No",
                "Date",
                "Scholar_No",
                "Class",
                "Session",
                "Description",
                "Mode_of_Pay",
                "Total_Amt",
                "Amt_Words"
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [receiptId, receiptNo, date, scholarNo, studentClass, session, description, modeOfPay, totalAmt, amtInWords];

        db.run(insertSql, params, function(err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({ error: "Receipt No. already exists" });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: "Fees receipt submitted successfully" });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// curl -X POST "http://localhost:3000/api/Fees/SubmitFeesReceipt" \
// -H "Content-Type: application/json" \
// -d '{
//     "receiptId": "year_23_24_Nur_1020",
//     "receiptNo": "1",
//     "date": "03-12-2024",
//     "scholarNo": "1020",
//     "class": "Nur",
//     "session": "year_23_24",
//     "description": "Fees Installment",
//     "modeOfPay": "Cash",
//     "totalAmt": 5000,
//     "amtInWords": "Five Thousand"
// }'