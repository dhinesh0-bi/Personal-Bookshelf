import React, { useState, useEffect } from 'react';

const SERVER_URL = 'https://my-bookshelf-server.onrender.com';

export default function BookList({ shouldRefresh, onBookAction }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/books`);
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (bookId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return; 
    }

    try {
      const res = await fetch(`${SERVER_URL}/books/${bookId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      alert(data.message);
      
      if (onBookAction) {
        onBookAction();
      }

    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book.');
    }
  };
  useEffect(() => {
    loadBooks();
  }, []);
  
  useEffect(() => {
    if (shouldRefresh > 0) {
      loadBooks();
    }
  }, [shouldRefresh]);


  if (loading) {
    return (
      <section className="widget">
        <h2>My Library</h2>
        <p>Loading library...</p>
      </section>
    );
  }

  return (
    <section className="widget">
      <h2>My Library</h2>
      <div id="book-list" className="book-list-grid"> 
        {books.length === 0 ? (
          <p>Your library is empty. Upload a book!</p>
        ) : (
          books.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-card-content">
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
              </div>
              <div className="book-card-actions">
                <a 
                  href={`${SERVER_URL}/${book.filePath}`} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  Read Now
                </a>
                <button 
                  className="delete-button" 
                  onClick={() => handleDelete(book.id, book.title)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}