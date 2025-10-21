import React, { useState } from 'react';
import Header from '../components/Header';
import BookUploadForm from '../components/BookUploadForm';
import BookList from '../components/BookList';

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBookUploaded = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <>
      <Header title="Dashboard" />
      <div className="content-area">
        <BookUploadForm onBookUploaded={handleBookUploaded} />
        <BookList shouldRefresh={refreshKey} />
      </div>
    </>
  );
}