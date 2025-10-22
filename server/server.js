
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8080;
const dbPath = path.join(__dirname, 'db.json');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads directory.');
}
const allowedOrigins = [
    'https://dreamy-biscuit-43d5d8.netlify.app', 
    'http://localhost:3000'                      
];

app.use(cors({
    origin: allowedOrigins
}));

app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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
app.get('/books', (req, res) => {
    try {
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        res.json(dbData.books);
    } catch (error) {
        console.error('Fetch Books Error:', error);
        res.status(500).json({ message: 'Error fetching books.' });
    }
});
app.delete('/books/:id', (req, res) => {
    try {
        const bookId = Number(req.params.id);
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const bookToDelete = dbData.books.find(book => book.id === bookId);

        if (bookToDelete) {
            const filePath = path.join(__dirname, bookToDelete.filePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
             }
        }
        const updatedBooks = dbData.books.filter(book => book.id !== bookId);
        dbData.books = updatedBooks;
        fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

        res.json({ message: 'Book deleted successfully!' });

    } catch (error) {
        console.error('Delete Book Error:', error);
        res.status(500).json({ message: 'Error deleting book.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});