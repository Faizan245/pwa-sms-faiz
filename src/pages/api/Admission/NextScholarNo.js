import sqlite3 from 'sqlite3';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export default (req, res) => {
  if (req.method === 'GET') {
    // Query to get the maximum scholar_no, cast to integer
    const sql = `SELECT MAX(CAST(scholar_no AS INTEGER)) AS max_scholar_no FROM admissions`;

    db.get(sql, [], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const maxScholarNo = row.max_scholar_no || 0;
    //   console.log(`Biggest scholar number in the database: ${maxScholarNo}`);

      const nextScholarNo = maxScholarNo + 1;
      res.status(200).json({ next_scholar_no: nextScholarNo });
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

//response
//  "next_scholar_no": 1129