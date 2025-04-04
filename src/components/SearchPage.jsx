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
        <span>Name : Yogesh Singh</span>
        <span><a href="mailto:yogeshsingh0076@gmail.com">Email: yogeshsingh0076@gmail.com</a></span>
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

        <div style={{display:"flex", flexDirection:"column"}}>
        <p style={{ textAlign: 'left', color: 'black', display:"flex", flexDirection:"column" }}>
              <strong>STEPS TO USE:</strong>
            </p>
            <ol style={{ textAlign: 'left', color: 'black' }}>
              <li>Step 1: Search for an image (e.g., mango, cake, etc.)</li>
              <li>Step 2: Click "Add Caption"</li>
              <li>Step 3: Type your caption in the provided text box</li>
              <li>Step 4: Select a shape (e.g., triangle, circle, rectangle, etc.), and customize its color and size as desired</li>
              <li>Step 5: Add any text you like, and adjust the text size and positioning</li>
              <li>Step 6: Click the "Download" button to save your edited image</li>
            </ol>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
