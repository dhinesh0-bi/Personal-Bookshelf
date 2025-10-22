import React, { useState } from 'react';
import Header from '../components/Header';
import BookUploadForm from '../components/BookUploadForm';
import BookList from '../components/BookList';

// src/pages/Dashboard.jsx

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBookAction = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <>
      <Header title="Dashboard" />
      <div className="content-area">
        {/* "onBookUploaded" is passed to the form */}
        <BookUploadForm onBookUploaded={handleBookAction} />
        
        {/* "onBookAction" must be passed to the list */}
        <BookList 
          shouldRefresh={refreshKey} 
          onBookAction={handleBookAction} // <-- MAKE SURE THIS LINE EXISTS
        />
      </div>
    </>
  );
}