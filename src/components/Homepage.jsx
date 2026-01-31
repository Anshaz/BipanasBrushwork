// src/components/Homepage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar'; // Import the shared Navbar
import './Homepage.css';
import artworks from '../data/artworks';
import { getImageVariants, pickSource } from '../utils/imageVariants';
import { useSEO } from '../seo/useSEO';

const Homepage = () => {
  useSEO({
    title: 'Original Art & Paintings',
    description:
      'Discover original artworks by Bipana—paintings inspired by Nepal and the Himalayas. Browse featured pieces, latest works, and the full gallery.',
    path: '/' ,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Bipana',
      url: 'https://bipanaart.com',
      jobTitle: 'Artist'
    }
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const featuredArtworks = artworks.filter(artwork => artwork.isFeatured);

    if (featuredArtworks.length > 0) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % featuredArtworks.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [artworks]); // Changed dependency to artworks

  return (
    <div className="homepage">
      {/* Use shared Navbar */}
      <Navbar />

      {/* Add top padding to account for fixed navbar */}
      <div style={{ paddingTop: '50px' }}>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to My
              <span className="highlight"> Art World</span>
            </h1>
            <p className="hero-subtitle">
              Explore original artworks shaped by the spirit of Nepal and the Himalayas, telling stories through rich color, texture, and emotion.            </p>
            <div className="hero-buttons">
              <Link to="/gallery" className="dialog-btn dialog-btn-confirm dialog-btn-login">View Gallery</Link>
              {/* <button className="btn btn-secondary">Commission Work</button> */}
            </div>
          </div>

          {/* Featured Artwork Carousel */}
          <div className="featured-artwork">
            <div className="artwork-carousel">
              {artworks
                .filter(artwork => artwork.isFeatured) // Only show featured artworks
                .map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className={`carousel-slide ${index === currentImageIndex ? 'active' : ''}`}
                  >
                    <div className="artwork-card">
                      {(() => {
                        const v = getImageVariants(artwork.image);
                        const isActive = index === currentImageIndex;
                        // Active slide uses a larger responsive image; inactive uses a tiny thumbnail
                        const src = isActive ? (pickSource(artwork.image, 640) || v.src) : v.thumb;
                        const srcSet = isActive ? v.srcSet : undefined;
                        return (
                          <img
                            src={src}
                            srcSet={srcSet}
                            sizes="(max-width: 768px) 90vw, 520px"
                        alt={`${artwork.title}${artwork.medium ? ` — ${artwork.medium}` : ''}${artwork.year ? ` (${artwork.year})` : ''} by Bipana`}
                        className="artwork-image-carousal"
                            loading={isActive ? 'eager' : 'lazy'}
                            decoding="async"
                          />
                        );
                      })()}
                      <div className="artwork-overlay">
                        <h3>{artwork.title}</h3>
                        <p>{artwork.medium} • {artwork.year}</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>

            {/* Only show indicators if there are featured artworks */}
            {artworks.filter(artwork => artwork.isFeatured).length > 0 && (
              <div className="carousel-indicators">
                {artworks
                  .filter(artwork => artwork.isFeatured) // Filter for indicators too
                  .map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))
                }
              </div>
            )}
          </div>
        </section>

        {/* Gallery Preview */}
        <section id="gallery" className="gallery-preview">
          <div className="container">
            <h2 className="section-title">Latest Works</h2>
            <div className="gallery-grid">
              {artworks
                .filter(artwork => artwork.latestWork === true)
                .map(artwork => (
                  <div key={artwork.id} className="gallery-item">
                    {(() => {
                      const v = getImageVariants(artwork.image);
                      return (
                        <img
                          src={v.thumb}
                          srcSet={v.srcSet}
                          sizes="(max-width: 768px) 45vw, 260px"
                      alt={`${artwork.title}${artwork.medium ? ` — ${artwork.medium}` : ''} by Bipana`}
                      loading="lazy"
                          decoding="async"
                        />
                      );
                    })()}
                    <div className="item-info">
                      <h4>{artwork.title}</h4>
                      <span>{artwork.medium}</span>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="view-all">
              <Link to="/gallery" className="btn btn-outline">View All Artworks</Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>Bipana's Brushwork</h3>
                <p>Showcasing unique artworks and creative expressions.</p>
              </div>
              <div className="footer-section">
                <h4>Connect</h4>
                <div className="social-links">
                  <a href="https://www.instagram.com/brushworkbybipana" aria-label="Instagram">IG</a>
                  <a href="https://bipanasbrushwork.etsy.com" aria-label="Etsy">ET</a>
                  <a href="https://de.pinterest.com/bipanadahal8844/" aria-label="Pinterest">PI</a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2025 Bipana's Brushwork. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;