// src/components/GalleryPage.jsx
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
import Dialog from './Dialog';
import AuthModal from './AuthModal';
import useDialog from '../hooks/useDialog';

const GalleryPage = () => {
  const [allArtworks, setAllArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [artworkStats, setArtworkStats] = useState({});
  const { currentUser, loginWithGoogle } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Use dialog hook
  const loginDialog = useDialog();
  const errorDialog = useDialog();

  // Load artworks from local data
  useEffect(() => {
    setAllArtworks(artworks);
    loadArtworkStats();
  }, [currentUser]); // Re-load when user auth changes

  const loadArtworkStats = async () => {
    const stats = {};    

    
    // Process artworks in batches to avoid too many simultaneous requests
    const batchSize = 5;
    
    for (let i = 0; i < artworks.length; i += batchSize) {
      const batch = artworks.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (artwork) => {
        try {
          // Get like count and comment count in parallel
          const [likeCount, comments] = await Promise.all([
            getLikeCount(artwork.id),
            getComments(artwork.id)
          ]);
          
          const commentCount = comments.length;
          
          // Check if current user liked it
          let userLiked = false;
          if (currentUser) {
            userLiked = await checkUserLike(artwork.id, currentUser.uid);
          }
          

          
          return {
            id: artwork.id,
            stats: { 
              likeCount, 
              userLiked, 
              commentCount 
            }
          };
        } catch (error) {
          console.error(`Error loading stats for ${artwork.id}:`, error);
          return {
            id: artwork.id,
            stats: { 
              likeCount: 0, 
              userLiked: false, 
              commentCount: 0 
            }
          };
        }
      });
      
      // Wait for batch to complete
      const batchResults = await Promise.all(batchPromises);
      
      // Update stats
      batchResults.forEach(({ id, stats: artworkStats }) => {
        stats[id] = artworkStats;
      });
    }
    

    setArtworkStats(stats);
  };

  const handleLike = async (e, artworkId) => {
    e.stopPropagation();
    
    if (!currentUser) {
      loginDialog.showDialog({
        title: 'Sign In Required',
        message: 'Please sign in to like artworks and interact with the community.',
        type: 'login',
        confirmText: 'Sign In Now',
        onConfirm: () => {
          loginDialog.hideDialog();
          setShowAuthModal(true); // Open AuthModal instead of Google login
        },
        cancelText: 'Continue Browsing',
        showCancel: true
      });
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
      errorDialog.showDialog({
        title: 'Error',
        message: 'Failed to like artwork. Please try again.',
        type: 'error'
      });
    }
  };

  // Add this function to update comment count when a new comment is added
  const updateCommentCount = (artworkId, change) => {
    setArtworkStats(prev => ({
      ...prev,
      [artworkId]: {
        ...prev[artworkId],
        commentCount: (prev[artworkId]?.commentCount || 0) + change
      }
    }));
  };

  const handleEtsyClick = (e, etsyLink) => {
    e.stopPropagation();
    window.open(etsyLink, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = (artwork) => {
    setSelectedArtwork(artwork);
  };

  // Refresh stats when modal closes (to get updated comment counts)
  const handleModalClose = () => {
    setSelectedArtwork(null);
    loadArtworkStats(); // Refresh stats to get updated comment counts
  };

  return (
    <div className="gallery-page">
      <Navbar />
            {/* Add AuthModal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
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
                          💬 <span className="comment-count">
                            {artworkStats[artwork.id]?.commentCount || 0}
                          </span>
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
            onClose={handleModalClose}
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
            // Pass the update function to the modal
            onCommentAdded={() => updateCommentCount(selectedArtwork.id, 1)}
            onCommentDeleted={() => updateCommentCount(selectedArtwork.id, -1)}
          />
        )}
      </div>

      {/* Dialogs */}
      <Dialog
        isOpen={loginDialog.isOpen}
        onClose={loginDialog.hideDialog}
        title={loginDialog.config.title}
        message={loginDialog.config.message}
        type={loginDialog.config.type}
        confirmText={loginDialog.config.confirmText || 'OK'}
        onConfirm={loginDialog.handleConfirm}
        cancelText={loginDialog.config.cancelText}
        onCancel={loginDialog.handleCancel}
        showCancel={loginDialog.config.showCancel}
      />

      <Dialog
        isOpen={errorDialog.isOpen}
        onClose={errorDialog.hideDialog}
        title={errorDialog.config.title}
        message={errorDialog.config.message}
        type={errorDialog.config.type}
        confirmText={errorDialog.config.confirmText || 'OK'}
        onConfirm={errorDialog.handleConfirm}
        cancelText={errorDialog.config.cancelText}
        onCancel={errorDialog.handleCancel}
        showCancel={errorDialog.config.showCancel}
      />
    </div>
  );
};

export default GalleryPage;