import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'DELETE') {
        const { receiptNo } = req.body;

        if (!receiptNo) {
            return res.status(400).json({ error: "Receipt_No is required" });
        }

        console.log("Fetching receipt with Receipt_No:", receiptNo);
        const fetchReceiptSql = `SELECT * FROM FeesReceipts WHERE Receipt_No = ?`;
        db.get(fetchReceiptSql, [receiptNo], (err, receipt) => {
            if (err) {
                console.error("Error fetching receipt:", err.message);
                return res.status(500).json({ error: err.message });
            }
            if (!receipt) {
                console.error("No receipt found with the provided Receipt_No");
                return res.status(404).json({ error: "No receipt found with the provided Receipt_No" });
            }

            const { Receipt_ID, Total_Amt, Date, Scholar_No, Class, Session, Description, Mode_of_Pay, Amt_Words } = receipt;
            console.log("Fetched receipt:", receipt);

            console.log("Inserting deleted receipt into DeletedReceipts table");
            const insertDeletedReceiptSql = `
                INSERT INTO DeletedReceipts (Receipt_ID, Receipt_No, Date, Scholar_No, Class, Session, Description, Mode_of_Pay, Total_Amt, Amt_Words)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(insertDeletedReceiptSql, [Receipt_ID, receiptNo, Date, Scholar_No, Class, Session, Description, Mode_of_Pay, Total_Amt, Amt_Words], function(err) {
                if (err) {
                    console.error("Error inserting deleted receipt:", err.message);
                    return res.status(500).json({ error: err.message });
                }
                console.log("Inserted deleted receipt into DeletedReceipts table");

                console.log("Deleting receipt with Receipt_No:", receiptNo);
                const deleteReceiptSql = `DELETE FROM FeesReceipts WHERE Receipt_No = ?`;
                db.run(deleteReceiptSql, [receiptNo], function(err) {
                    if (err) {
                        console.error("Error deleting receipt:", err.message);
                        return res.status(500).json({ error: err.message });
                    }
                    if (this.changes === 0) {
                        console.error("No receipt found with the provided Receipt_No");
                        return res.status(404).json({ error: "No receipt found with the provided Receipt_No" });
                    }

                    console.log("Deleted receipt with Receipt_No:", receiptNo);

                    if (Description === "Fees Installment" || Description === "RTE") {
                        console.log("Updating FeesDetail with StudentFeesID:", Receipt_ID, "Amount:", Total_Amt);
                        const updateFeesDetailSql = `
                            UPDATE FeesDetail
                            SET 
                                Deposited = Deposited - ?,
                                Remaining = Remaining + ?
                            WHERE StudentFeesID = ?
                        `;
                        console.log("Update SQL:", updateFeesDetailSql);
                        console.log("Update Params:", [Total_Amt, Total_Amt, Receipt_ID]);
                        db.run(updateFeesDetailSql, [Total_Amt, Total_Amt, Receipt_ID], function(err) {
                            if (err) {
                                console.error("Error updating fees detail:", err.message);
                                return res.status(500).json({ error: err.message });
                            }
                            console.log("Updated FeesDetail for StudentFeesID:", Receipt_ID);
                            res.status(200).json({ message: "Receipt deleted and fees details updated successfully" });
                        });
                    } else {
                        res.status(200).json({ message: "Receipt deleted successfully" });
                    }
                });
            });
        });
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// curl -X DELETE "http://localhost:3000/api/Fees/DeleteReceipt" \
// -H "Content-Type: application/json" \
// -d '{
//     "receiptNo": "12345"
// }'