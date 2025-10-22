// --- 1. IMPORTS ---
// All require statements go at the top
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// --- 2. APP & CONSTANTS ---
const app = express();
const PORT = 8080;
const dbPath = path.join(__dirname, 'db.json');

// --- 3. CREATE UPLOADS FOLDER ---
// Create the 'uploads' directory if it doesn't exist on server start
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads directory.');
}

// --- 4. MIDDLEWARE ---
// Set up CORS to allow both your live site and localhost
const allowedOrigins = [
    'https://dreamy-biscuit-43d5d8.netlify.app', // Your live Netlify app
    'http://localhost:3000'                      // Your local development app
];

app.use(cors({
    origin: allowedOrigins
}));

// Allow the server to parse JSON bodies
app.use(express.json()); 
// Serve the 'uploads' folder as a static folder so files can be viewed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 5. MULTER STORAGE CONFIG ---
// Tell Multer where to save the files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save to 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep the original filename
    }
});

const upload = multer({ storage: storage });

// --- 6. API ENDPOINTS ---

/**
 * POST /upload
 * Handles file upload and saves book metadata to db.json
 */
app.post('/upload', upload.single('bookFile'), (req, res) => {
    try {
        const { title, author } = req.body;
        const filePath = `uploads/${req.file.originalname}`;
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

        const newBook = {
            id: Date.now(),
            title,
            author,
            filePath: filePath
        };
        dbData.books.push(newBook);
        fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

        res.json({ message: 'Book uploaded successfully!', book: newBook });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Error uploading file.' });
    }
});

/**
 * GET /books
 * Returns the list of all books from db.json
 */
app.get('/books', (req, res) => {
    try {
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        res.json(dbData.books);
    } catch (error) {
        console.error('Fetch Books Error:', error);
        res.status(500).json({ message: 'Error fetching books.' });
    }
});

/**
 * DELETE /books/:id
 * Deletes a book's PDF file and its entry from db.json
 */
app.delete('/books/:id', (req, res) => {
    try {
        const bookId = Number(req.params.id);
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

        // Find the book we are trying to delete
        const bookToDelete = dbData.books.find(book => book.id === bookId);

        if (bookToDelete) {
            // 1. Delete the actual PDF file
            const filePath = path.join(__dirname, bookToDelete.filePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // This deletes the file
            }
        }

        // 2. Filter the database list to remove the book entry
        const updatedBooks = dbData.books.filter(book => book.id !== bookId);
        dbData.books = updatedBooks;

        // 3. Save the new list back to db.json
        fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

        res.json({ message: 'Book deleted successfully!' });

    } catch (error) {
        console.error('Delete Book Error:', error);
        res.status(500).json({ message: 'Error deleting book.' });
    }
});

// --- 7. START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});