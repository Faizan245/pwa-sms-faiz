import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disables Next.js's body parser to let Formidable handle the request
  },
};

export default function handler(req, res) {
  // Create a new instance of IncomingForm
  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), 'public/media/profilePhoto'), // Directory where files will be stored
    keepExtensions: true, // Keep file extensions (e.g., .jpg)
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
    const fileName = `photo${fields.scholar_no}.jpg`;

    // Set the destination path for the image
    const destinationPath = path.join(process.cwd(), 'public/media/profilePhoto', fileName);

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
            // Respond with the path to the stored image
            res.status(200).json({ filePath: `/media/profilePhoto/${fileName}` });
          });
        });
      } else {
        // If file doesn't exist, move the new file to the destination
        fs.rename(filePath, destinationPath, (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error moving the file' });
          }
          // Respond with the path to the stored image
          res.status(200).json({ filePath: `/media/profilePhoto/${fileName}` });
        });
      }
    });
  });
}
