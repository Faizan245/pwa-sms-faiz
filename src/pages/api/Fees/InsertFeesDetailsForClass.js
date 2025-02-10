import sqlite3 from 'sqlite3';
import path from 'path';
import fetch from 'node-fetch';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default async (req, res) => {
    if (req.method === 'POST') {
        const { session, class: studentClass } = req.body;

        if (!session || !studentClass) {
            return res.status(400).json({ error: "Session and Class are required" });
        }

        // Fetch students from the admissions table
        const fetchStudentsSql = `SELECT scholar_no, student_name, family_id FROM admissions WHERE ${session} = ?`;
        db.all(fetchStudentsSql, [studentClass], async (err, students) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (students.length === 0) {
                return res.status(404).json({ error: "No students found for this session and class" });
            }

            // Fetch total fees for the class
            const totalFeesResponse = await fetch(`${req.headers.origin}/api/Fees/FetchTotalFees?Session=${session}&Class=${studentClass}`);

            const totalFeesData = await totalFeesResponse.json();
            if (totalFeesData.error) {
                return res.status(500).json({ error: totalFeesData.error });
            }
            const totalFees = totalFeesData.totalFees;

            // Process each student
            students.forEach(student => {
                const studentFeesID = `${session}_${studentClass}_${student.scholar_no}`;
                const checkSql = `SELECT 1 FROM FeesDetail WHERE StudentFeesID = ?`;
                db.get(checkSql, [studentFeesID], (err, row) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    if (!row) {
                        // Insert new record into FeesDetail
                        const insertSql = `
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
                        `;
                        const params = [
                            studentFeesID,
                            student.scholar_no,
                            student.student_name,
                            student.family_id,
                            totalFees,
                            0, // Discount
                            0, // Deposited
                            totalFees // Remaining
                        ];
                        db.run(insertSql, params, function(err) {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }
                        });
                    } else {
                        // Update existing record in FeesDetail
                        const updateSql = `
                            UPDATE FeesDetail SET
                                "Student_Name" = ?,
                                "Family_ID" = ?
                            WHERE "StudentFeesID" = ?
                        `;
                        const updateParams = [
                            student.student_name,
                            student.family_id,
                            studentFeesID
                        ];
                        db.run(updateSql, updateParams, function(err) {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }
                        });
                    }
                });
            });

            res.status(200).json({ message: "Fees details processed successfully" });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


// curl -X POST "http://localhost:3000/api/Fees/InsertFeesDetailsForClass" \
// -H "Content-Type: application/json" \
// -d '{
//     "session": "year_23_24",
//     "class": "Nur"
// }'