import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
  if (req.method === 'POST') {
    const data = req.body;
    const scholarNo = data.scholar_no;

    if (!scholarNo) {
      return res.status(400).json({ error: 'Scholar No. is required' });
    }

    // Capitalize names if present
    if (data.student_name) {
      data.student_name = data.student_name.replace(/\b\w/g, (char) => char.toUpperCase());
    }
    if (data.father_name) {
      data.father_name = data.father_name.replace(/\b\w/g, (char) => char.toUpperCase());
    }
    if (data.mother_name) {
      data.mother_name = data.mother_name.replace(/\b\w/g, (char) => char.toUpperCase());
    }

    // Check if scholar_no exists in the database
    db.get(`SELECT scholar_no FROM admissions WHERE scholar_no = ?`, [scholarNo], (err, row) => {
      if (err) {
        console.error('Database error:', err.message); // Log the error internally
        return res.status(500).json({ error: 'Internal server error. Please try again later.' });
      }

      if (!row) {
        // Scholar No. does not exist in the database
        return res.status(400).json({ error: 'Scholar No. does not exist' });
      }

      // SQL Query to update the record
      const sql = `UPDATE admissions SET
        student_name = ?,
        dob = ?,
        gender = ?,
        samagra_id = ?,
        family_id = ?,
        contact_no = ?,
        father_name = ?,
        mother_name = ?,
        cast = ?,
        aadhar_number = ?,
        name_on_aadhar = ?,
        whatsapp_no = ?,
        previous_class = ?,
        admission_under = ?,
        admission_date = ?,
        admission_class = ?,
        address = ?,
        bank_account = ?,
        ifsc_code = ?,
        photo = ?,
        document = ?
        WHERE scholar_no = ?`;

      const params = [
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
        scholarNo
      ];

      // Execute the query
      db.run(sql, params, function (err) {
        if (err) {
          console.error('SQL Error:', err.message); // Log SQL error
          return res.status(500).json({ error: 'Error updating record. Please try again later.' });
        }
        res.status(200).json({ message: 'Record updated successfully', data: data });
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
