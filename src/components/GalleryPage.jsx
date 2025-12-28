// src/components/GalleryPage.jsx (updated)
import React, { useState, useEffect } from 'react';
import artworks from '../data/artworks';
import Navbar from './Navbar';
import ImageZoomModal from './ImageZoomModal';
import { useAuth } from '../contexts/AuthContext';
import { 
  getLikeCount, 
  checkUserLike, 
  likeArtwork,
  getComments 
} from '../services/artworkInteraction';
import './GalleryPage.css';

const GalleryPage = () => {
  const [allArtworks, setAllArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [artworkStats, setArtworkStats] = useState({});
  const { currentUser } = useAuth();

  // Load artworks from local data
  useEffect(() => {
    setAllArtworks(artworks);
    loadArtworkStats();
  }, []);

  const loadArtworkStats = async () => {
    const stats = {};
    for (const artwork of artworks) {
      const likeCount = await getLikeCount(artwork.id);
      let userLiked = false;
      
      if (currentUser) {
        userLiked = await checkUserLike(artwork.id, currentUser.uid);
      }
      
      const commentCount = 0; // You can add this if you want to show count on cards
      
      stats[artwork.id] = { likeCount, userLiked, commentCount };
    }
    setArtworkStats(stats);
  };

  const handleLike = async (e, artworkId) => {
    e.stopPropagation();
    
    if (!currentUser) {
      // Show auth modal or message
      alert('Please sign in to like artworks');
      return;
    }
    
    try {
      const result = await likeArtwork(artworkId, currentUser.uid);
      const newStats = { ...artworkStats };
      
      if (result.liked) {
        newStats[artworkId] = {
          ...newStats[artworkId],
          likeCount: newStats[artworkId].likeCount + 1,
          userLiked: true
        };
      } else {
        newStats[artworkId] = {
          ...newStats[artworkId],
          likeCount: newStats[artworkId].likeCount - 1,
          userLiked: false
        };
      }
      
      setArtworkStats(newStats);
    } catch (error) {
      console.error('Error liking artwork:', error);
    }
  };

  const handleEtsyClick = (e, etsyLink) => {
    e.stopPropagation();
    window.open(etsyLink, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = (artwork) => {
    setSelectedArtwork(artwork);
  };

  return (
    <div className="gallery-page">
      <Navbar />
      <div style={{ paddingTop: '30px' }}>
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
                      
                      {/* Like and Comment Count */}
                      <div className="artwork-interaction">
                        <button 
                          className={`like-btn ${artworkStats[artwork.id]?.userLiked ? 'liked' : ''}`}
                          onClick={(e) => handleLike(e, artwork.id)}
                          title={currentUser ? 'Like this artwork' : 'Sign in to like'}
                        >
                          ❤️ <span className="like-count">{artworkStats[artwork.id]?.likeCount || 0}</span>
                        </button>
                        
                        <button 
                          className="comment-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(artwork);
                          }}
                          title="View comments"
                        >
                          💬 <span className="comment-count">0</span>
                        </button>
                      </div>
                      
                      {artwork.onEtsy && artwork.etsyLink && (
                        <div className="etsy-link-mobile">
                          <a 
                            href={artwork.etsyLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="etsy-link-text"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Buy on Etsy
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