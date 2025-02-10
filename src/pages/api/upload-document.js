import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's body parsing to allow formidable to handle the file parsing
  },
};

export default function handler(req, res) {
  // Create a new instance of IncomingForm
  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), 'public/media/StudentDocuments'), // Directory to store uploaded documents
    keepExtensions: true, // Keep the original file extension (e.g., .pdf)
  });

  // Parse the incoming request
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File parsing error' });
    }

    // Get the uploaded file (file field in form)
    const uploadedFile = files.file[0]; // Assuming the input field is named 'file'

    // Get the path of the uploaded file
    const filePath = uploadedFile.filepath; // Temporary file path on the server

    // Create the new file name based on scholar_no
    const fileName = `Document${fields.scholar_no}.pdf`;

    // Set the destination path for the document
    const destinationPath = path.join(process.cwd(), 'public/media/StudentDocuments', fileName);

    // Check if the file already exists and delete it
    fs.exists(destinationPath, (exists) => {
      if (exists) {
        fs.unlink(destinationPath, (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error deleting the existing file' });
          }

          // Move the new file from the temporary location to the desired folder
          fs.rename(filePath, destinationPath, (err) => {
            if (err) {
              return res.status(500).json({ error: 'Error moving the file' });
            }
            // Respond with the path to the stored document
            res.status(200).json({ filePath: `/media/StudentDocuments/${fileName}` });
          });
        });
      } else {
        // If file doesn't exist, move the new file to the destination
        fs.rename(filePath, destinationPath, (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error moving the file' });
          }
          // Respond with the path to the stored document
          res.status(200).json({ filePath: `/media/StudentDocuments/${fileName}` });
        });
      }
    });
  });
}
