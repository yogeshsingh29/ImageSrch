import React from 'react';
import axios from 'axios';

const SearchPage = ({ onImageSelect }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);



  const searchImages = async () => {
    if (!searchTerm) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get('https://api.pexels.com/v1/search', {
        headers: {
          Authorization: import.meta.env.VITE_PEXELS_API_KEY,
        },
        params: {
          query: searchTerm,
          per_page: 4,
        },
      });

      setImages(response.data.photos || []);
      setError('');
    } catch (err) {
      console.error('Error fetching images:', err.response || err.message);
      setError(
        err.response?.status === 401
          ? 'Invalid API key.'
          : err.response?.status === 429
          ? 'Rate limit exceeded. Please try again later.'
          : 'Failed to fetch images. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchImages();
    }
  };

  return (
    <div className="search-page">
      <div className="user-Data">
        <span>Name : yogesh</span>
        <span>Email : yogesh@gmail.com</span>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading images...</p>}

      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your search term"
        />
        <button onClick={searchImages} disabled={loading}>
          {loading ? 'Searching...' : '🔍'}
        </button>
      </div>

      <div className="results-grid">
        {images.length > 0 ? (
          images.map((photo) => (
            <div key={photo.id} className="result-item">
              <img src={photo.src.medium} alt={photo.alt} />
              <button onClick={() => onImageSelect(photo.src.large)}>
                Add Caption
              </button>
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
