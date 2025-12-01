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

  // Handle Etsy button click - open in new tab
  const handleEtsyClick = (e, etsyLink) => {
    e.stopPropagation(); // Prevent triggering the parent click
    window.open(etsyLink, '_blank', 'noopener,noreferrer');
  };

  // Handle card click - only open modal
  const handleCardClick = (artwork) => {
    setSelectedArtwork(artwork);
  };

  return (
    <div className="gallery-page">
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
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
                    onClick={() => handleCardClick(artwork)}
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
                          {artwork.onEtsy && artwork.etsyLink && (
                            <span 
                              className="buy-button"
                              onClick={(e) => handleEtsyClick(e, artwork.etsyLink)}
                            >
                              Buy on Etsy!
                            </span>
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
                      {artwork.onEtsy && artwork.etsyLink && (
                        <div className="etsy-link-mobile">
                          <a 
                            href={artwork.etsyLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="etsy-link-text"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Available on Etsy
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

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