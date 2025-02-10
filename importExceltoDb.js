import sqlite3 from 'sqlite3';
import path from 'path';
import xlsx from 'xlsx';
import moment from 'moment';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Path to the Excel file
const excelFilePath = path.resolve(process.cwd(), 'BPSdata.xlsx');

// Read the Excel file
const workbook = xlsx.readFile(excelFilePath);
const sheetName = 'admission';
const worksheet = workbook.Sheets[sheetName];

// Convert the worksheet to JSON
const data = xlsx.utils.sheet_to_json(worksheet);

// Function to capitalize the first letter of each word
const capitalizeWords = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

// Function to parse and format dates
const parseDate = (dateStr) => {
  // Check if the date is a serial number
  if (!isNaN(dateStr)) {
    // Convert Excel serial number to JavaScript date
    const date = moment(new Date((dateStr - (25567 + 2)) * 86400 * 1000));
    return date.format('DD/MM/YYYY');
  }

  // Parse date strings
  let date = moment(dateStr, ['DD-MM-YYYY', 'DD-MM-YY', 'YYYY-MM-DD', 'MM/DD/YYYY', 'MM/DD/YY'], true);
  if (!date.isValid()) {
    console.error(`Invalid date: ${dateStr}`);
    return null;
  }
  return date.format('DD/MM/YYYY');
};

// Insert data into the database
db.serialize(() => {
  const sql = `INSERT INTO admissions (
    scholar_no, student_name, dob, gender, samagra_id, family_id, contact_no, 
    father_name, mother_name, cast, aadhar_number, name_on_aadhar, whatsapp_no, 
    previous_class, admission_under, admission_date, admission_class, address, 
    bank_account, ifsc_code, photo, document, year_23_24, year_24_25, year_25_26, year_26_27
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const stmt = db.prepare(sql);

  data.forEach((row) => {
    // Capitalize names
    row["Student's Name"] = capitalizeWords(row["Student's Name"]);
    row["Father's Name"] = capitalizeWords(row["Father's Name"]);
    row["Mother's Name"] = capitalizeWords(row["Mother's Name"]);

    // Format dates
    const dob = parseDate(row["Student's DOB"]);
    const admissionDate = parseDate(row['Admission Date']);

    if (!dob || !admissionDate) {
      console.error(`Skipping row due to invalid date: ${JSON.stringify(row)}`);
      return;
    }

    // Remove '.0' from numeric fields
    const contactNo = row['Contact No.'] ? row['Contact No.'].toString().replace(/\.0$/, '') : '';
    const whatsappNo = row['WhatsApp No.'] ? row['WhatsApp No.'].toString().replace(/\.0$/, '') : '';
    const aadharNumber = row['Aadhar Number'] ? row['Aadhar Number'].toString().replace(/\.0$/, '') : '';
    const bankAccount = row['Bank Account'] ? row['Bank Account'].toString().replace(/\.0$/, '') : '';

    // Log the formatted dates for debugging
    console.log(`Formatted DOB: ${dob}, Formatted Admission Date: ${admissionDate}`);

    const params = [
      row['Scholar No.'],
      row["Student's Name"],
      dob,
      row['Gender'],
      row['Samagra ID'],
      row['Family ID'],
      contactNo,
      row["Father's Name"],
      row["Mother's Name"],
      row['Cast'],
      aadharNumber,
      row['Name on Aadhar'],
      whatsappNo,
      row['Previous Class'],
      row['Admission Under'],
      admissionDate,
      row['Admission Class'],
      row['Address'],
      bankAccount,
      row['IFSC Code'],
      row['Photo'],
      row['Document'],
      row['year_23_24'],
      row['year_24_25'],
      row['year_25_26'],
      row['year_26_27']
    ];

    stmt.run(params, (err) => {
      if (err) {
        console.error('Error inserting row:', err.message);
      } else {
        // console.log('Row inserted successfully:', params);
      }
    });
  });

  stmt.finalize();
});

db.close((err) => {
  if (err) {
    console.error('Error closing the database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});