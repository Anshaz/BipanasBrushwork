// src/components/GalleryPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
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
import { useSEO } from '../seo/useSEO';
import { getImageVariants } from '../utils/imageVariants';

// --- Helpers for ISO date sorting/filtering ---
// Expected: artwork.date = "YYYY-MM-DD"
const getArtworkTime = (artwork) => {
  const t = Date.parse(artwork?.date);
  return Number.isNaN(t) ? -Infinity : t;
};

// Use year from artwork.year if present, otherwise derive from date (YYYY-MM-DD)
const getArtworkYear = (artwork) => {
  const y = (artwork?.year ?? '').toString().trim();
  if (y) return y;

  const d = (artwork?.date ?? '').toString().trim();
  if (d && d.length >= 4) return d.slice(0, 4);

  return '';
};

const GalleryPage = () => {
  useSEO({
    title: 'Gallery',
    description:
      'Browse the full gallery of original artworks by Bipana. Filter by medium, year, and discover featured and latest works.',
    path: '/gallery',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: "Bipana's Brushwork — Gallery",
      url: 'https://bipanaart.com/gallery'
    }
  });

  const [allArtworks, setAllArtworks] = useState([]);

  // Gallery controls
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMedium, setFilterMedium] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [sortBy, setSortBy] = useState('featured'); // featured | newest | oldest | title

  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [artworkStats, setArtworkStats] = useState({});
  const { currentUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const resetFilters = () => {
    setSearchQuery('');
    setFilterMedium('all');
    setFilterYear('all');
    setSortBy('featured');
  };

  const mediumOptions = useMemo(() => {
    const set = new Set(
      allArtworks
        .map((a) => (a.medium || '').toString().trim())
        .filter(Boolean)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allArtworks]);

  const yearOptions = useMemo(() => {
    const set = new Set(
      allArtworks
        .map((a) => getArtworkYear(a))
        .map((y) => y.toString().trim())
        .filter(Boolean)
    );

    // Sort years descending if numeric, else lexicographic
    return Array.from(set).sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
      const bothNums = !Number.isNaN(na) && !Number.isNaN(nb);
      if (bothNums) return nb - na;
      return b.localeCompare(a);
    });
  }, [allArtworks]);

  const displayedArtworks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = [...allArtworks];

    // Filter: medium
    if (filterMedium !== 'all') {
      list = list.filter((a) => (a.medium || '').toString() === filterMedium);
    }

    // Filter: year (derived from date if needed)
    if (filterYear !== 'all') {
      list = list.filter((a) => getArtworkYear(a) === filterYear);
    }

    // Search
    if (q) {
      list = list.filter((a) => {
        const haystack = [
          a.title,
          a.medium,
          getArtworkYear(a),
          a.date, // include full date in search
          a.dimensions,
          a.price
        ]
          .filter(Boolean)
          .map((v) => v.toString().toLowerCase())
          .join(' • ');
        return haystack.includes(q);
      });
    }

    // Sort
    if (sortBy === 'featured') {
      list.sort((a, b) => {
        const fa = a.isFeatured ? 1 : 0;
        const fb = b.isFeatured ? 1 : 0;
        if (fa !== fb) return fb - fa;

        // then newest by date
        const td = getArtworkTime(b) - getArtworkTime(a);
        if (td !== 0) return td;

        return (a.title || '').localeCompare(b.title || '');
      });
    } else if (sortBy === 'newest') {
      list.sort((a, b) => {
        const td = getArtworkTime(b) - getArtworkTime(a);
        if (td !== 0) return td;
        return (a.title || '').localeCompare(b.title || '');
      });
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => {
        const td = getArtworkTime(a) - getArtworkTime(b);
        if (td !== 0) return td;
        return (a.title || '').localeCompare(b.title || '');
      });
    } else if (sortBy === 'title') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return list;
  }, [allArtworks, filterMedium, filterYear, searchQuery, sortBy]);

  // Use dialog hook
  const loginDialog = useDialog();
  const errorDialog = useDialog();

  // Load artworks from local data
  useEffect(() => {
    setAllArtworks(artworks);
    // loadArtworkStats();
  }, [currentUser]); // Re-load when user auth changes

  const loadArtworkStats = async () => {
    const stats = {};
    const batchSize = 5;

    for (let i = 0; i < artworks.length; i += batchSize) {
      const batch = artworks.slice(i, i + batchSize);

      const batchPromises = batch.map(async (artwork) => {
        try {
          const [likeCount, comments] = await Promise.all([
            getLikeCount(artwork.id),
            getComments(artwork.id)
          ]);

          const commentCount = comments.length;

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

      const batchResults = await Promise.all(batchPromises);
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
          setShowAuthModal(true);
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
          likeCount: (newStats[artworkId]?.likeCount || 0) + 1,
          userLiked: true
        };
      } else {
        newStats[artworkId] = {
          ...newStats[artworkId],
          likeCount: (newStats[artworkId]?.likeCount || 0) - 1,
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

  const handleEtsyClick = (e, etsyLink) => {
    e.stopPropagation();
    window.open(etsyLink, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleModalClose = () => {
    setSelectedArtwork(null);
    // loadArtworkStats();
  };

  return (
    <div className="gallery-page">
      <Navbar />

      {/* Auth modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div>
        <section className="gallery-grid-section">
          <div className="container">
            {/* Controls */}
            <div className="gallery-controls">
              <div className="controls-top">
                <div className="search-field">
                  <input
                    className="search-input"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artworks (title, medium, date...)"
                    aria-label="Search artworks"
                  />
                  {searchQuery && (
                    <button
                      className="search-clear"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      type="button"
                    >
                      ×
                    </button>
                  )}
                </div>

                <button
                  className="filters-reset"
                  onClick={resetFilters}
                  type="button"
                  disabled={
                    !searchQuery &&
                    filterMedium === 'all' &&
                    filterYear === 'all' &&
                    sortBy === 'featured'
                  }
                >
                  Reset
                </button>
              </div>

              <div className="filters-row">
                <label className="filter-group">
                  <span className="filter-label">Medium</span>
                  <select
                    className="filter-select"
                    value={filterMedium}
                    onChange={(e) => setFilterMedium(e.target.value)}
                  >
                    <option value="all">All</option>
                    {mediumOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="filter-group">
                  <span className="filter-label">Year</span>
                  <select
                    className="filter-select"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                  >
                    <option value="all">All</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="filter-group">
                  <span className="filter-label">Sort</span>
                  <select
                    className="filter-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured first</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="title">Title (A–Z)</option>
                  </select>
                </label>

                <div className="results-count" aria-live="polite">
                  {displayedArtworks.length} artwork{displayedArtworks.length === 1 ? '' : 's'}
                </div>
              </div>
            </div>

            {/* Grid */}
            {displayedArtworks.length === 0 ? (
              <div className="empty-state">
                <h3>No artworks found</h3>
                <p>Try changing filters or search terms.</p>
              </div>
            ) : (
              <div className="artworks-grid">
                {displayedArtworks.map((artwork) => (
                  (() => {
                    const v = getImageVariants(artwork.image);
                    return (
                  <div
                    key={artwork.id}
                    className="artwork-card"
                    onClick={() => handleCardClick(artwork)}
                  >
                    <div className="artwork-image-container">
                      <img
                        src={v.thumb}
                        alt={`${artwork.title}${artwork.medium ? ` — ${artwork.medium}` : ''}${getArtworkYear(artwork) ? ` (${getArtworkYear(artwork)})` : ''} by Bipana`}
                        className="artwork-image"
                        loading="lazy"
                        decoding="async"
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
                      {artwork.isFeatured && <div className="featured-badge">Featured</div>}
                    </div>

                    <div className="artwork-info">
                      <h3 className="artwork-title">{artwork.title}</h3>
                      <p className="artwork-medium">{artwork.medium}</p>

                      {/* Prefer showing year (derived if needed); keep your existing layout intact */}
                      <p className="artwork-year">{getArtworkYear(artwork) || artwork.year}</p>

                      {artwork.dimensions && (
                        <p className="artwork-dimensions">{artwork.dimensions}</p>
                      )}
                      {artwork.price && <p className="artwork-price">${artwork.price}</p>}

                      {/* Like and Comment Count (kept commented out) */}
                      {/* <div className="artwork-interaction">
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
                      </div> */}

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
                    );
                  })()
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Modal (navigates within filtered/sorted results) */}
        {selectedArtwork && (
          <ImageZoomModal
            artwork={selectedArtwork}
            onClose={handleModalClose}
            onNext={() => {
              const currentIndex = displayedArtworks.findIndex(
                (art) => art.id === selectedArtwork.id
              );
              const nextIndex = (currentIndex + 1) % displayedArtworks.length;
              setSelectedArtwork(displayedArtworks[nextIndex]);
            }}
            onPrev={() => {
              const currentIndex = displayedArtworks.findIndex(
                (art) => art.id === selectedArtwork.id
              );
              const prevIndex =
                currentIndex === 0 ? displayedArtworks.length - 1 : currentIndex - 1;
              setSelectedArtwork(displayedArtworks[prevIndex]);
            }}
            hasNext={displayedArtworks.length > 1}
            hasPrev={displayedArtworks.length > 1}
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
