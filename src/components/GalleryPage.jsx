// src/components/GalleryPage.jsx
import React, { useState, useEffect } from 'react';
import artworks from '../data/artworks';
import Navbar from './Navbar';
import ImageZoomModal from './ImageZoomModal';
import './GalleryPage.css';

const GalleryPage = () => {
  const [allArtworks, setAllArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // Load artworks from local data
  useEffect(() => {
    setAllArtworks(artworks);
  }, []);

  return (
    <div className="gallery-page">
      {/* Use shared Navbar */}
      <Navbar />

      {/* Add top padding to account for fixed navbar */}
      <div style={{ paddingTop: '80px' }}>
        {/* Artworks Grid */}
        <section className="gallery-grid-section">
          <div className="container">
            {allArtworks.length === 0 ? (
              <div className="empty-state">
                <h3>No artworks found</h3>
                <p>Check back later for new artworks.</p>
              </div>
            ) : (
              <div className="artworks-grid">
                {allArtworks.map(artwork => (
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
                                {artwork.onEtsy && (
                                    <span className="buy-button">Buy on Etsy!</span>
                                )}
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
              const currentIndex = allArtworks.findIndex(
                art => art.id === selectedArtwork.id
              );
              const nextIndex = (currentIndex + 1) % allArtworks.length;
              setSelectedArtwork(allArtworks[nextIndex]);
            }}
            onPrev={() => {
              const currentIndex = allArtworks.findIndex(
                art => art.id === selectedArtwork.id
              );
              const prevIndex = currentIndex === 0 ? 
                allArtworks.length - 1 : currentIndex - 1;
              setSelectedArtwork(allArtworks[prevIndex]);
            }}
            hasNext={allArtworks.length > 1}
            hasPrev={allArtworks.length > 1}
          />
        )}
      </div>
    </div>
  );
};

export default GalleryPage;