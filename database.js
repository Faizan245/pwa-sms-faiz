const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the database file
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database opening error:', err);
  } else {
    console.log('Database connected.');
  }
});

db.serialize(() => {
  // Create admin table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `, function(err) {
    if (err) {
      console.error('Error creating admin table:', err);
    } else {
      console.log('Admin table created.');
    }

    // Check if the admin credentials already exist
    db.get(`SELECT * FROM admin WHERE username = 'admin'`, function(err, row) {
      if (err) {
        console.error('Error querying admin credentials:', err);
      } else if (!row) {
        // Insert admin credentials if not already inserted
        db.run(`
          INSERT INTO admin (username, password)
          VALUES ('admin', 'password')
        `, function(err) {
          if (err) {
            console.error('Error inserting admin credentials:', err);
          } else {
            console.log('Admin credentials inserted.');
          }
        });
      } else {
        console.log('Admin credentials already exist.');
      }
    });
  });

  // Create admissions table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS admissions (
      scholar_no TEXT PRIMARY KEY,
      student_name TEXT,
      dob DATE,
      gender TEXT,
      samagra_id TEXT,
      family_id TEXT,
      contact_no TEXT,
      father_name TEXT,
      mother_name TEXT,
      cast TEXT,
      aadhar_number TEXT,
      name_on_aadhar TEXT,
      whatsapp_no TEXT,
      previous_class TEXT,
      admission_under TEXT,
      admission_date DATE,
      admission_class TEXT,
      address TEXT,
      bank_account TEXT,
      ifsc_code TEXT,
      photo TEXT,
      document TEXT,
      year_23_24 TEXT,
      year_24_25 TEXT,
      year_25_26 TEXT,
      year_26_27 TEXT
    )
  `, function(err) {
    if (err) {
      console.error('Error creating admissions table:', err);
    } else {
      console.log('Admissions table created.');
    }
  });

  // Create deletedadmission table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS deletedadmission (
      scholar_no TEXT PRIMARY KEY,
      student_name TEXT,
      dob DATE,
      gender TEXT,
      samagra_id TEXT,
      family_id TEXT,
      contact_no TEXT,
      father_name TEXT,
      mother_name TEXT,
      cast TEXT,
      aadhar_number TEXT,
      name_on_aadhar TEXT,
      whatsapp_no TEXT,
      previous_class TEXT,
      admission_under TEXT,
      admission_date DATE,
      admission_class TEXT,
      address TEXT,
      bank_account TEXT,
      ifsc_code TEXT,
      photo TEXT,
      document TEXT,
      year_23_24 TEXT,
      year_24_25 TEXT,
      year_25_26 TEXT,
      year_26_27 TEXT
    )
  `, function(err) {
    if (err) {
      console.error('Error creating deletedadmission table:', err);
    } else {
      console.log('Deletedadmission table created.');
    }
  });

// Create DeletedReceipts table
db.run(`
  CREATE TABLE IF NOT EXISTS DeletedReceipts (
      "Receipt_ID" TEXT,
      "Receipt_No" INTEGER PRIMARY KEY,
      "Date" TEXT NOT NULL,
      "Scholar_No" TEXT NOT NULL,
      "Class" TEXT NOT NULL,
      "Session" TEXT NOT NULL,
      "Description" TEXT,
      "Mode_of_Pay" TEXT NOT NULL,
      "Total_Amt" REAL NOT NULL,
      "Amt_Words" TEXT NOT NULL,
      "Deleted_At" DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, function(err) {
  if (err) {
      console.error("Error creating DeletedReceipts table:", err.message);
  } else {
      console.log("DeletedReceipts table created successfully.");
  }
});

// Create FeesReceipts table
db.run(`
  CREATE TABLE IF NOT EXISTS FeesReceipts (
      "Receipt_ID" TEXT,
      "Receipt_No" INTEGER PRIMARY KEY,
      "Date" TEXT NOT NULL,
      "Scholar_No" TEXT NOT NULL,
      "Class" TEXT NOT NULL,
      "Session" TEXT NOT NULL,
      "Description" TEXT,
      "Mode_of_Pay" TEXT NOT NULL,
      "Total_Amt" REAL NOT NULL,
      "Amt_Words" TEXT NOT NULL
  )
`, function(err) {
  if (err) {
      console.error("Error creating FeesReceipts table:", err.message);
  } else {
      console.log("FeesReceipts table created successfully.");
  }
});

// Create FeesDetail table
db.run(`
  CREATE TABLE IF NOT EXISTS FeesDetail (
      "StudentFeesID" TEXT PRIMARY KEY,
      "Scholar_No" TEXT NOT NULL,
      "Student_Name" TEXT NOT NULL,
      "Family_ID" TEXT,
      "Total_Fees" REAL NOT NULL,
      "Discount" REAL NOT NULL,
      "Deposited" REAL NOT NULL,
      "Remaining" REAL NOT NULL
  )
`, function(err) {
  if (err) {
      console.error("Error creating FeesDetail table:", err.message);
  } else {
      console.log("FeesDetail table created successfully.");
  }
});

  // Create FeesStructure table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS FeesStructure (
      Session TEXT PRIMARY KEY,
      Admission_Fees_Nur REAL,
      Tution_Fees_Nur REAL,
      Activity_Fees_Nur REAL,
      Management_Fees_Nur REAL,
      Exam_Fees_Nur REAL,
      Other_Fees_Nur REAL,
      Total_Fees_Nur REAL,
      Emi_1_Nur REAL,
      Emi_2_Nur REAL,
      Emi_3_Nur REAL,
      Emi_4_Nur REAL,
      Admission_Fees_Kg1 REAL,
      Tution_Fees_Kg1 REAL,
      Activity_Fees_Kg1 REAL,
      Management_Fees_Kg1 REAL,
      Exam_Fees_Kg1 REAL,
      Other_Fees_Kg1 REAL,
      Total_Fees_Kg1 REAL,
      Emi_1_Kg1 REAL,
      Emi_2_Kg1 REAL,
      Emi_3_Kg1 REAL,
      Emi_4_Kg1 REAL,
      Admission_Fees_Kg2 REAL,
      Tution_Fees_Kg2 REAL,
      Activity_Fees_Kg2 REAL,
      Management_Fees_Kg2 REAL,
      Exam_Fees_Kg2 REAL,
      Other_Fees_Kg2 REAL,
      Total_Fees_Kg2 REAL,
      Emi_1_Kg2 REAL,
      Emi_2_Kg2 REAL,
      Emi_3_Kg2 REAL,
      Emi_4_Kg2 REAL,
      Admission_Fees_1st REAL,
      Tution_Fees_1st REAL,
      Activity_Fees_1st REAL,
      Management_Fees_1st REAL,
      Exam_Fees_1st REAL,
      Other_Fees_1st REAL,
      Total_Fees_1st REAL,
      Emi_1_1st REAL,
      Emi_2_1st REAL,
      Emi_3_1st REAL,
      Emi_4_1st REAL,
      Admission_Fees_2nd REAL,
      Tution_Fees_2nd REAL,
      Activity_Fees_2nd REAL,
      Management_Fees_2nd REAL,
      Exam_Fees_2nd REAL,
      Other_Fees_2nd REAL,
      Total_Fees_2nd REAL,
      Emi_1_2nd REAL,
      Emi_2_2nd REAL,
      Emi_3_2nd REAL,
      Emi_4_2nd REAL,
      Admission_Fees_3rd REAL,
      Tution_Fees_3rd REAL,
      Activity_Fees_3rd REAL,
      Management_Fees_3rd REAL,
      Exam_Fees_3rd REAL,
      Other_Fees_3rd REAL,
      Total_Fees_3rd REAL,
      Emi_1_3rd REAL,
      Emi_2_3rd REAL,
      Emi_3_3rd REAL,
      Emi_4_3rd REAL,
      Admission_Fees_4th REAL,
      Tution_Fees_4th REAL,
      Activity_Fees_4th REAL,
      Management_Fees_4th REAL,
      Exam_Fees_4th REAL,
      Other_Fees_4th REAL,
      Total_Fees_4th REAL,
      Emi_1_4th REAL,
      Emi_2_4th REAL,
      Emi_3_4th REAL,
      Emi_4_4th REAL,
      Admission_Fees_5th REAL,
      Tution_Fees_5th REAL,
      Activity_Fees_5th REAL,
      Management_Fees_5th REAL,
      Exam_Fees_5th REAL,
      Other_Fees_5th REAL,
      Total_Fees_5th REAL,
      Emi_1_5th REAL,
      Emi_2_5th REAL,
      Emi_3_5th REAL,
      Emi_4_5th REAL,
      Admission_Fees_6th REAL,
      Tution_Fees_6th REAL,
      Activity_Fees_6th REAL,
      Management_Fees_6th REAL,
      Exam_Fees_6th REAL,
      Other_Fees_6th REAL,
      Total_Fees_6th REAL,
      Emi_1_6th REAL,
      Emi_2_6th REAL,
      Emi_3_6th REAL,
      Emi_4_6th REAL,
      Admission_Fees_7th REAL,
      Tution_Fees_7th REAL,
      Activity_Fees_7th REAL,
      Management_Fees_7th REAL,
      Exam_Fees_7th REAL,
      Other_Fees_7th REAL,
      Total_Fees_7th REAL,
      Emi_1_7th REAL,
      Emi_2_7th REAL,
      Emi_3_7th REAL,
      Emi_4_7th REAL,
      Admission_Fees_8th REAL,
      Tution_Fees_8th REAL,
      Activity_Fees_8th REAL,
      Management_Fees_8th REAL,
      Exam_Fees_8th REAL,
      Other_Fees_8th REAL,
      Total_Fees_8th REAL,
      Emi_1_8th REAL,
      Emi_2_8th REAL,
      Emi_3_8th REAL,
      Emi_4_8th REAL,
      Admission_Fees_9th REAL,
      Tution_Fees_9th REAL,
      Activity_Fees_9th REAL,
      Management_Fees_9th REAL,
      Exam_Fees_9th REAL,
      Other_Fees_9th REAL,
      Total_Fees_9th REAL,
      Emi_1_9th REAL,
      Emi_2_9th REAL,
      Emi_3_9th REAL,
      Emi_4_9th REAL,
      Admission_Fees_10th REAL,
      Tution_Fees_10th REAL,
      Activity_Fees_10th REAL,
      Management_Fees_10th REAL,
      Exam_Fees_10th REAL,
      Other_Fees_10th REAL,
      Total_Fees_10th REAL,
      Emi_1_10th REAL,
      Emi_2_10th REAL,
      Emi_3_10th REAL,
      Emi_4_10th REAL,
      Admission_Fees_11th REAL,
      Tution_Fees_11th REAL,
      Activity_Fees_11th REAL,
      Management_Fees_11th REAL,
      Exam_Fees_11th REAL,
      Other_Fees_11th REAL,
      Total_Fees_11th REAL,
      Emi_1_11th REAL,
      Emi_2_11th REAL,
      Emi_3_11th REAL,
      Emi_4_11th REAL,
      Admission_Fees_12th REAL,
      Tution_Fees_12th REAL,
      Activity_Fees_12th REAL,
      Management_Fees_12th REAL,
      Exam_Fees_12th REAL,
      Other_Fees_12th REAL,
      Total_Fees_12th REAL,
      Emi_1_12th REAL,
      Emi_2_12th REAL,
      Emi_3_12th REAL,
      Emi_4_12th REAL
    )
  `, function(err) {
    if (err) {
      console.error('Error creating FeesStructure table:', err);
    } else {
      console.log('FeesStructure table created.');
    }
    db.close();
  });
});