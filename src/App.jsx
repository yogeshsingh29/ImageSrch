import React, { useState } from 'react';
import './App.css';
import SearchPage from './components/SearchPage';
import CaptionPage from './components/CaptionPage';
import { Toaster, toast } from 'react-hot-toast';  

function App() {
  const [page, setPage] = useState('search');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    setPage('caption');
    toast.success('Image selected!'); 
  };

  const handleBackToSearch = () => {
    setPage('search');
    setSelectedImage(null);
    toast.success('Back to search page!'); 
  };

  return (
    <div className="App">
      <Toaster />
      {page === 'search' ? (
        <SearchPage onImageSelect={handleImageSelect} />
      ) : (
        <CaptionPage imageUrl={selectedImage} onBack={handleBackToSearch} />
      )}
    </div>
  );
}

export default App;
