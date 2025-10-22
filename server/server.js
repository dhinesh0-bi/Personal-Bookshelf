const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;
// --- Get your frontend's live URL from Render ---
const frontendURL = 'https://my-bookshelf-app.onrender.com'; // <-- PASTE YOUR FRONTEND URL HERE

app.use(cors({
  origin: frontendURL
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const dbPath = path.join(__dirname, 'db.json');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
app.post('/upload', upload.single('bookFile'), (req, res) => {
  try {
    const { title, author } = req.body;
    const filePath = `uploads/${req.file.originalname}`;
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const newBook = {
      title,
      author,
      filePath: filePath
    };
    dbData.books.push(newBook);
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    res.json({ message: 'Book uploaded successfully!', book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading file.' });
  }
});
app.get('/books', (req, res) => {
  try {
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    res.json(dbData.books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching books.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});