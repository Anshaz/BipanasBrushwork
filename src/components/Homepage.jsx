import React, { useState, useEffect } from 'react';
import './Homepage.css';

const Homepage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sample artwork data - replace with your actual images
  const artworkImages = [
    {
      id: 1,
      src: '/Annapurna.jpg',
      title: 'Sunset Dreams',
      medium: 'Oil on Canvas',
      year: '2024'
    },
    {
      id: 2,
      src: '/Annapurna.jpg',
      title: 'Urban Rhythm',
      medium: 'Acrylic',
      year: '2024'
    },
    {
      id: 3,
      src: '/Annapurna.jpg',
      title: 'Ocean Whisper',
      medium: 'Watercolor',
      year: '2023'
    }
  ];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % artworkImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [artworkImages.length]);

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-text">Bipana's Brushwork</span>
          </div>
          
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <a href="#gallery" className="nav-link">Gallery</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>

          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to My
            <span className="highlight"> Art World</span>
          </h1>
          <p className="hero-subtitle">
            Discover a collection of unique artworks that tell stories through color, texture, and emotion.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">View Gallery</button>
            <button className="btn btn-secondary">Commission Work</button>
          </div>
        </div>
        
        {/* Featured Artwork Carousel */}
        <div className="featured-artwork">
          <div className="artwork-carousel">
            {artworkImages.map((artwork, index) => (
              <div
                key={artwork.id}
                className={`carousel-slide ${index === currentImageIndex ? 'active' : ''}`}
              >
                <div className="artwork-card">
                  <img 
                    src={artwork.src} 
                    alt={artwork.title}
                    className="artwork-image"
                  />
                  <div className="artwork-overlay">
                    <h3>{artwork.title}</h3>
                    <p>{artwork.medium} • {artwork.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="carousel-indicators">
            {artworkImages.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="gallery" className="gallery-preview">
        <div className="container">
          <h2 className="section-title">Latest Works</h2>
          <div className="gallery-grid">
            {artworkImages.map(artwork => (
              <div key={artwork.id} className="gallery-item">
                <img src={artwork.src} alt={artwork.title} />
                <div className="item-info">
                  <h4>{artwork.title}</h4>
                  <span>{artwork.medium}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all">
            <button className="btn btn-outline">View All Artworks</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>ArtGallery</h3>
              <p>Showcasing unique artworks and creative expressions.</p>
            </div>
            <div className="footer-section">
              <h4>Connect</h4>
              <div className="social-links">
                <a href="#" aria-label="Instagram">IG</a>
                <a href="#" aria-label="Twitter">TW</a>
                <a href="#" aria-label="Facebook">FB</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 ArtGallery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;