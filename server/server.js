const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;
// --- Get your frontend's live URL from Render ---
// CORRECT (use your main site URL)
const frontendURL =  'https://dreamy-biscuit-43d5d8.netlify.app'; // <-- PASTE YOUR FRONTEND URL HERE

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
      id: Date.now(), // <-- ADD THIS LINE
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

// 3. Handle Book Deletions
app.delete('/books/:id', (req, res) => {
  try {
    // Get the ID from the URL and convert it to a number
    const bookId = Number(req.params.id); 

    // Read the db.json file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Filter the books array, keeping only the books that DO NOT match the ID
    const updatedBooks = dbData.books.filter(book => book.id !== bookId);
    dbData.books = updatedBooks;

    // Write the new, filtered data back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    res.json({ message: 'Book deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting book.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});