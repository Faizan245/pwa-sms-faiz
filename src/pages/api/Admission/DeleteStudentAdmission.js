import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'POST') {
        const { scholar_no } = req.body;

        if (!scholar_no) {
            return res.status(400).json({ error: "Scholar number is required" });
        }

        // Fetch the student detail from the admissions table
        const fetchSql = `SELECT * FROM admissions WHERE scholar_no = ?`;
        db.get(fetchSql, [scholar_no], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!row) {
                return res.status(404).json({ error: "Record not found" });
            }

            // Insert the student detail into the deletedadmission table
            const insertSql = `INSERT INTO deletedadmission (scholar_no, student_name, dob, gender, contact_no, father_name, mother_name, admission_class, admission_date, address, samagra_id, family_id, cast, aadhar_number, name_on_aadhar, whatsapp_no, previous_class, admission_under, bank_account, ifsc_code, photo, document, year_23_24, year_24_25, year_25_26, year_26_27) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const params = [
                row.scholar_no, row.student_name, row.dob, row.gender, row.contact_no, row.father_name, row.mother_name, row.admission_class, row.admission_date, row.address, row.samagra_id, row.family_id, row.cast, row.aadhar_number, row.name_on_aadhar, row.whatsapp_no, row.previous_class, row.admission_under, row.bank_account, row.ifsc_code, row.photo, row.document, row.year_23_24, row.year_24_25, row.year_25_26, row.year_26_27
            ];

            db.run(insertSql, params, (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                // Delete the student detail from the admissions table
                const deleteSql = `DELETE FROM admissions WHERE scholar_no = ?`;
                db.run(deleteSql, [scholar_no], (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    res.status(200).json({ message: "Record deleted and moved to deletedadmission table" });
                });
            });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}