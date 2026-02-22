// src/components/Homepage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Homepage.css';
import artworks from '../data/artworks';
import { getImageVariants, pickSource } from '../utils/imageVariants';
import { useSEO } from '../seo/useSEO';
import ETSY_REVIEWS from './etsyReviews';

const Homepage = () => {
  useSEO({
    title: 'Original Art & Paintings',
    description:
      'Discover original artworks by Bipana—paintings inspired by Nepal and the Himalayas. Browse featured pieces, latest works, and the full gallery.',
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Bipana',
      url: 'https://bipanaart.com',
      jobTitle: 'Artist'
    }
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const featuredArtworks = artworks.filter(artwork => artwork.isFeatured);

    if (featuredArtworks.length > 0) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % featuredArtworks.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [artworks]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <div className="homepage">
      <Navbar />
      <div>

        {/* Full-screen Hero Image with Overlay */}
        <section className="hero-full">
          <div className="hero-image-container">
            <img
              src="/images/everest-1280.webp"
              alt="Himalayan Art"
              className="hero-image"
            />
            <div className="hero-overlay">
              <div className="hero-content-modern">
                <span className="hero-subtitle-modern">BIPANA'S ARTWORK</span>
                <h1 className="hero-title-modern">Where the Himalayas<br />Meet the Canvas</h1>
                <p className="hero-description">
                  Original artworks shaped by the spirit of Nepal, telling stories through rich color, texture, and emotion.
                </p>
                <div className="hero-actions">
                  <Link to="/gallery" className="btn-modern btn-primary-modern">Explore Collection</Link>
                  <Link to="/about" className="btn-modern btn-outline-modern">Meet the Artist</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="scroll-indicator">
            <span>Scroll to discover</span>
            <div className="scroll-line"></div>
          </div>
        </section>

        {/* Featured Artworks Gallery */}
        <section className="featured-section">
          <div className="container-modern">
            <div className="section-header">
              <span className="section-tag">Curated Selection</span>
              <h2 className="section-title-modern">Featured Works</h2>
              <p className="section-description">
                A glimpse into my latest creations, where traditional Himalayan aesthetics meet contemporary expression.
              </p>
            </div>

            <div className="featured-grid">
              {artworks
                .filter(artwork => artwork.isFeatured)
                .slice(0, 3)
                .map((artwork, index) => {
                  const v = getImageVariants(artwork.image);
                  return (
                    <div key={artwork.id} className={`featured-grid-item item-${index + 1}`}>
                      <div className="featured-card">
                        <div className="featured-image-wrapper">
                          <img
                            src={v.src}
                            srcSet={v.srcSet}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            alt={artwork.title}
                            className="featured-image"
                            loading={index === 0 ? 'eager' : 'lazy'}
                          />
                          <div className="featured-overlay">
                            <Link to="/gallery" className="view-artwork-btn">
                              View Gallery
                            </Link>
                          </div>
                        </div>
                        <div className="featured-info">
                          <h3 className="featured-title">{artwork.title}</h3>
                          <p className="featured-medium">{artwork.medium} • {artwork.year}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {/* 
            <div className="featured-navigation">
              {artworks.filter(artwork => artwork.isFeatured).length > 3 && (
                <div className="carousel-dots">
                  {artworks
                    .filter(artwork => artwork.isFeatured)
                    .map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`View artwork ${index + 1}`}
                      />
                    ))}
                </div>
              )}
            </div> */}
          </div>
        </section>

        {/* Studio Video Section */}
        <section className="studio-section">
          <div className="container-modern">
            <div className="studio-grid">
              <div className="studio-content">
                <span className="section-tag">Behind the Art</span>
                <h2 className="studio-title">In the Studio</h2>
                <p className="studio-text">
                  Watch the creative process unfold. Each brushstroke carries the essence of the Himalayas,
                  transforming raw emotion into visual poetry.
                </p>
                <div className="studio-stats">
                  <div className="stat-item">
                    <span className="stat-number">15+</span>
                    <span className="stat-label">Original Works</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">5+</span>
                    <span className="stat-label">Years Creating</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Happy Collectors</span>
                  </div>
                </div>
              </div>
              <div className="studio-video">
                <div className="video-wrapper" onClick={handleVideoClick}>
                  <video
                    ref={videoRef}
                    poster="/images/video-poster.png"
                    className="video-player"
                    loop
                    muted
                  >
                    <source src="/images/WIP.mp4" type="video/mp4" />
                  </video>
                  <div className={`video-play-btn ${isVideoPlaying ? 'playing' : ''}`}>
                    {isVideoPlaying ? '⏸' : '▶'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Moving banner */}
        <section className="moving-banner" aria-label="Announcements">
          <div className="moving-banner__track">
            <div className="moving-banner__content">
              <span>Original Himalayan landscape paintings</span>
              <span>Handmade & one-of-a-kind</span>
              <span>Worldwide shipping available</span>
              <span>New works added regularly</span>
              <span>Shop on Etsy: bipanaart.etsy.com</span>
            </div>
            <div className="moving-banner__content" aria-hidden="true">
              <span>Original Himalayan landscape paintings</span>
              <span>Handmade & one-of-a-kind</span>
              <span>Worldwide shipping available</span>
              <span>New works added regularly</span>
              <span>Shop on Etsy: bipanaart.etsy.com</span>
            </div>
          </div>
        </section>

        {/* Latest Works */}
        <section id="gallery" className="latest-works-section">
          <div className="container-modern">
            <div className="section-header">
              <span className="section-tag">New Arrivals</span>
              <h2 className="section-title-modern">Latest Works</h2>
              <p className="section-description">
                Fresh from the studio — explore my most recent creations.
              </p>
            </div>

            <div className="masonry-grid">
              {artworks
                .filter(artwork => artwork.latestWork === true)
                .map((artwork, index) => {
                  const v = getImageVariants(artwork.image);
                  return (
                    <div key={artwork.id} className={`masonry-item masonry-item-${index + 1}`}>
                      <Link to="/gallery" className="masonry-link">
                        <div className="masonry-image-wrapper">
                          <img
                            src={v.src}
                            srcSet={v.srcSet}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            alt={artwork.title}
                            className="masonry-image"
                            loading="lazy"
                          />
                          <div className="masonry-overlay">
                            <div className="masonry-info">
                              <h3 className="masonry-title">{artwork.title}</h3>
                              <p className="masonry-details">{artwork.medium}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })
              }
            </div>

            <div className="view-all-container">
              <Link to="/gallery" className="btn-modern btn-outline-modern btn-large">
                View Full Collection
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="container-modern">
            <div className="section-header centered">
              <span className="section-tag">Testimonials</span>
              <h2 className="section-title-modern">What Collectors Say</h2>
            </div>

            <div className="testimonials-grid">
              {ETSY_REVIEWS.slice(0, 3).map((r, idx) => (
                <div key={idx} className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="quote-mark">"</div>
                    <p className="testimonial-text">{r.text}</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <span className="author-name">{r.name}</span>
                      <div className="author-rating">
                        {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="testimonials-footer">
              <a
                href="https://bipanaart.etsy.com"
                target="_blank"
                rel="noreferrer"
                className="btn-modern btn-etsy"
              >
                Read more reviews on Etsy
                <span className="btn-arrow">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer-modern">
          <div className="container-modern">
            <img src="/images/logo2.png" alt="Bipana's Artwork" className="footer-logo" />
            <div className="footer-main">
              <div className="footer-brand">
                <h3 className="footer-brand-name">Bipana's Art</h3>
                <p className="footer-brand-description">
                  Showcasing unique artworks inspired by the Himalayas, created with passion and precision.
                </p>
              </div>
              <div className="footer-links">
                <div className="footer-links-column">
                  <h4 className="footer-links-title">Explore</h4>
                  <ul>
                    <li><Link to="/gallery">Gallery</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                  </ul>
                </div>
                <div className="footer-links-column">
                  <h4 className="footer-links-title">Connect</h4>
                  <ul>
                    <li><a href="https://www.instagram.com/bipanaart" target="_blank" rel="noreferrer">Instagram</a></li>
                    <li><a href="https://bipanasbrushwork.etsy.com" target="_blank" rel="noreferrer">Etsy</a></li>
                    <li><a href="https://de.pinterest.com/bipanadahal8844/" target="_blank" rel="noreferrer">Pinterest</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="footer-bottom-modern">
              <p>&copy; 2025 Bipana's Art. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;