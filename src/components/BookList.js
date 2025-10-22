import React, { useState, useEffect } from 'react';

const SERVER_URL = 'https://my-bookshelf-server.onrender.com';

export default function BookList({ shouldRefresh }) {
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

  useEffect(() => {
    loadBooks();
  }, []);
  
  useEffect(() => {
    if (shouldRefresh > 0) {
      loadBooks();
    }
  }, [shouldRefresh]);


  if (loading) return <p>Loading library...</p>;

  return (
    <section className="widget">
      <h2>My Library</h2>
      <div id="book-list" className="book-list">
        {books.length === 0 ? (
          <p>Your library is empty. Upload a book!</p>
        ) : (
          books.map((book, index) => (
            <div key={index} className="book-item">
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <a href={`${SERVER_URL}/${book.filePath}`} target="_blank" rel="noreferrer">
                Read Now
              </a>
            </div>
          ))
        )}
      </div>
    </section>
  );
}