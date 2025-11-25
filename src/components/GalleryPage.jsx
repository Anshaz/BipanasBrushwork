// src/components/GalleryPage.jsx
import React, { useState, useEffect } from 'react';
import artworks from '../data/artworks'; // Import local data
import ImageZoomModal from './ImageZoomModal';
import './GalleryPage.css';

const GalleryPage = () => {
  const [allArtworks, setAllArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Load artworks from local data
  useEffect(() => {
    setAllArtworks(artworks);
  }, []);

  // Filter and sort artworks
  const filteredAndSortedArtworks = allArtworks
    .filter(artwork => {
      if (filter === 'all') return true;
      if (filter === 'featured') return artwork.isFeatured;
      return artwork.medium?.toLowerCase().includes(filter.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });

  // Get unique mediums for filter
  const mediums = [...new Set(allArtworks.map(artwork => artwork.medium).filter(Boolean))];

  return (
    <div className="gallery-page">

      {/* Artworks Grid */}
      <section className="gallery-grid-section">
        <div className="container">
          {filteredAndSortedArtworks.length === 0 ? (
            <div className="empty-state">
              <h3>No artworks found</h3>
              <p>Try changing your filters or check back later.</p>
            </div>
          ) : (
            <div className="artworks-grid">
              {filteredAndSortedArtworks.map(artwork => (
                <div 
                  key={artwork.id} 
                  className="artwork-card"
                  onClick={() => setSelectedArtwork(artwork)}
                >
                  <div className="artwork-image-container">
                    <img 
                      src={artwork.image} 
                      alt={artwork.title}
                      className="artwork-image"
                      loading="lazy"
                    />
                    <div className="artwork-overlay">
                      <div className="overlay-content">
                        <span className="view-button">View Details</span>
                      </div>
                    </div>
                    {artwork.isFeatured && (
                      <div className="featured-badge">Featured</div>
                    )}
                  </div>
                  
                  <div className="artwork-info">
                    <h3 className="artwork-title">{artwork.title}</h3>
                    <p className="artwork-medium">{artwork.medium}</p>
                    <p className="artwork-year">{artwork.year}</p>
                    {artwork.dimensions && (
                      <p className="artwork-dimensions">{artwork.dimensions}</p>
                    )}
                    {artwork.price && (
                      <p className="artwork-price">${artwork.price}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Zoom Modal */}
      {selectedArtwork && (
        <ImageZoomModal 
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onNext={() => {
            const currentIndex = filteredAndSortedArtworks.findIndex(
              art => art.id === selectedArtwork.id
            );
            const nextIndex = (currentIndex + 1) % filteredAndSortedArtworks.length;
            setSelectedArtwork(filteredAndSortedArtworks[nextIndex]);
          }}
          onPrev={() => {
            const currentIndex = filteredAndSortedArtworks.findIndex(
              art => art.id === selectedArtwork.id
            );
            const prevIndex = currentIndex === 0 ? 
              filteredAndSortedArtworks.length - 1 : currentIndex - 1;
            setSelectedArtwork(filteredAndSortedArtworks[prevIndex]);
          }}
          hasNext={filteredAndSortedArtworks.length > 1}
          hasPrev={filteredAndSortedArtworks.length > 1}
        />
      )}
    </div>
  );
};

export default GalleryPage;