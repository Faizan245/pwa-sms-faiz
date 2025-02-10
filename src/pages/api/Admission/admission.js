import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
    if (req.method === 'POST') {
        const data = req.body; // फ्रंटएंड से डेटा प्राप्त करें
        const scholarNo = data.scholar_no;

        // Validate admission year (should match required format)
        const validYears = ['year_23_24', 'year_24_25', 'year_25_26', 'year_26_27'];
        if (!validYears.includes(data.admission_year)) {
            return res.status(400).json({ "error": "Invalid admission year" });
        }

        // Default year columns को खाली रखें
        const yearColumns = {
            year_23_24: '',
            year_24_25: '',
            year_25_26: '',
            year_26_27: ''
        };
        data.student_name = data.student_name.replace(/\b\w/g, (char) => char.toUpperCase());
        data.father_name = data.father_name.replace(/\b\w/g, (char) => char.toUpperCase());
        data.mother_name = data.mother_name.replace(/\b\w/g, (char) => char.toUpperCase());
        // सही कॉलम में admission_class सेट करें
        yearColumns[data.admission_year] = data.admission_class;

        // Format dates to dd/mm/yyyy
        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };
        data.dob = formatDate(data.dob);
        data.admission_date = formatDate(data.admission_date);

        // Check if scholar_no पहले से मौजूद है
        db.get(`SELECT scholar_no FROM admissions WHERE scholar_no = ?`, [scholarNo], (err, row) => {
            if (err) {
                return res.status(500).json({ "error": err.message });
            }

            if (row) {
                // Scholar No. already exists
                return res.status(400).json({ "error": "Scholar No. already exists" });
            }

            // SQL Query
            const sql = `INSERT INTO admissions (
                scholar_no, student_name, dob, gender, samagra_id, family_id, contact_no, 
                father_name, mother_name, cast, aadhar_number, name_on_aadhar, whatsapp_no, 
                previous_class, admission_under, admission_date, admission_class, address, 
                bank_account, ifsc_code, photo, document, year_23_24, year_24_25, year_25_26, year_26_27
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; 

            // Parameters for SQL query
            const params = [
                scholarNo,
                data.student_name,
                data.dob,
                data.gender,
                data.samagra_id,
                data.family_id,
                data.contact_no,
                data.father_name,
                data.mother_name,
                data.cast,
                data.aadhar_number,
                data.name_on_aadhar,
                data.whatsapp_no,
                data.previous_class,
                data.admission_under,
                data.admission_date,
                data.admission_class,
                data.address,
                data.bank_account,
                data.ifsc_code,
                data.photoPath,
                data.documentPath,
                yearColumns.year_23_24,
                yearColumns.year_24_25,
                yearColumns.year_25_26,
                yearColumns.year_26_27
            ];

            // Query Execute करें
            db.run(sql, params, function (err) {
                if (err) {
                    return res.status(500).json({ "error": err.message });
                }
                res.status(200).json({ 
                    "message": "Record added successfully", 
                    "data": data, 
                    id: this.lastID 
                });
            });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};