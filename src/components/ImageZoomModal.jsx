// src/components/ImageZoomModal.jsx
import React, { useEffect, useState } from 'react';
import './ImageZoomModal.css';

const ImageZoomModal = ({
  artwork,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Reset zoom and position when artwork changes
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setImageLoaded(false);
  }, [artwork]);
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(3, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(3, prev + 0.25));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(0.5, prev - 0.25));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
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

            {/* Conditional Etsy status */}
            {artwork.onEtsy ? (
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
            ) : (
              <div className="not-on-etsy-message">
                <p className="not-on-etsy-text">
                  This artwork is currently not on Etsy.
                  <br />
                  <a href="/contact" className="contact-link">
                    Contact us to place an order
                  </a>
                </p>
              </div>
            )}
          </div>
          <div className="modal-controls">
            <div className="zoom-controls">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
                className="zoom-btn"
              >
                −
              </button>
              <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
                className="zoom-btn"
              >
                +
              </button>
              {zoomLevel > 1 && (
                <button onClick={resetZoom} className="reset-btn">
                  Reset
                </button>
              )}
            </div>
            <button onClick={onClose} className="close-btn">
              ×
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="image-container">
          {!imageLoaded && (
            <div className="image-loading">
              <div className="loading-spinner"></div>
              <p>Loading image...</p>
            </div>
          )}

          <div
            className="image-wrapper"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: zoomLevel > 1 ? 'grab' : 'default' }}
          >
            <img
              src={artwork.image}  // Use artwork.image instead of artwork.imageUrl
              alt={artwork.title}
              className={`zoom-image ${imageLoaded ? 'loaded' : ''}`}
              style={{
                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
              }}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Navigation Arrows */}
          {hasPrev && (
            <button
              onClick={onPrev}
              className="nav-arrow nav-arrow-prev"
              aria-label="Previous artwork"
            >
              ‹
            </button>
          )}
          {hasNext && (
            <button
              onClick={onNext}
              className="nav-arrow nav-arrow-next"
              aria-label="Next artwork"
            >
              ›
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="artwork-description">
            {artwork.description && (
              <p className="description">{artwork.title}</p>
            )}
            {artwork.price && (
              <p className="artwork-price">${artwork.price}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageZoomModal;