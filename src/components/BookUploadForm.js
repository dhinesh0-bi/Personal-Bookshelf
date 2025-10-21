import React, { useState } from 'react';

export default function BookUploadForm({ onBookUploaded }) {
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.target);
    
    try {
      const res = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      alert(data.message);
      
      e.target.reset(); 
      onBookUploaded(); 
      
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="widget">
      <h2>Upload a New Book</h2>
      <form id="book-form" className="book-form" onSubmit={handleSubmit}>
        <input type="text" id="title" name="title" placeholder="Book Title" required />
        <input type="text" id="author" name="author" placeholder="Author" required />
        <input type="file" id="bookFile" name="bookFile" accept=".pdf" required />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Book'}
        </button>
      </form>
    </section>
  );
}