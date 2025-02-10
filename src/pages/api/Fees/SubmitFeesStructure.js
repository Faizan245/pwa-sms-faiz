import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'POST') {
        const { Session, ...fees } = req.body;

        if (!Session) {
            return res.status(400).json({ error: "Session is required" });
        }

        const classes = ["Nur", "Kg1", "Kg2", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
        const feeTypes = ["Admission_Fees", "Tution_Fees", "Activity_Fees", "Management_Fees", "Exam_Fees", "Other_Fees", "Total_Fees", "Emi_1", "Emi_2", "Emi_3", "Emi_4"];

        // Check if the session already exists
        const checkSql = `SELECT * FROM FeesStructure WHERE Session = ?`;
        db.get(checkSql, [Session], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            let sql;
            const params = [];

            if (row) {
                // Build the update SQL dynamically
                sql = `UPDATE FeesStructure SET `;
                classes.forEach(cls => {
                    feeTypes.forEach(feeType => {
                        const key = `${feeType}_${cls}`;
                        sql += `${key} = ?, `;
                        params.push(fees[key]);
                    });
                });
                sql = sql.slice(0, -2); // Remove the last comma and space
                sql += ` WHERE Session = ?`;
                params.push(Session);
            } else {
                // Build the insert SQL dynamically
                sql = `INSERT INTO FeesStructure (Session, `;
                classes.forEach(cls => {
                    feeTypes.forEach(feeType => {
                        sql += `${feeType}_${cls}, `;
                    });
                });
                sql = sql.slice(0, -2); // Remove the last comma and space
                sql += `) VALUES (?, `;
                classes.forEach(cls => {
                    feeTypes.forEach(feeType => {
                        sql += `?, `;
                        params.push(fees[`${feeType}_${cls}`]);
                    });
                });
                sql = sql.slice(0, -2); // Remove the last comma and space
                sql += `)`;
                params.unshift(Session);
            }

            db.run(sql, params, (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                // Update the Total_Fees and Remaining in FeesDetail table
                const updateFeesDetailPromises = classes.map(cls => {
                    const totalFeesKey = `Total_Fees_${cls}`;
                    const totalFeesValue = fees[totalFeesKey];
                    const studentFeesIDPrefix = `${Session}_${cls}_`;

                    const updateFeesDetailSql = `
                        UPDATE FeesDetail
                        SET Total_Fees = ?,
                            Remaining = (Total_Fees - Discount - Deposited)
                        WHERE StudentFeesID LIKE ?
                    `;
                    return new Promise((resolve, reject) => {
                        db.run(updateFeesDetailSql, [totalFeesValue, `${studentFeesIDPrefix}%`], function(err) {
                            if (err) {
                                return reject(err);
                            }
                            resolve();
                        });
                    });
                });

                Promise.all(updateFeesDetailPromises)
                    .then(() => {
                        res.status(200).json({ message: row ? "Fees structure updated successfully" : "Fees structure added successfully" });
                    })
                    .catch(error => {
                        res.status(500).json({ error: error.message });
                    });
            });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}