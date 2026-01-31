// src/components/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './AboutPage.css';
import { useSEO } from '../seo/useSEO';

const AboutPage = () => {
  useSEO({
    title: 'About',
    description:
      'Learn about Bipana, her artistic journey, and the inspiration behind the artworks influenced by Nepal and the Himalayas.',
    path: '/about',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Bipana',
      url: 'https://bipanaart.com/about'
    }
  });
  return (
    <div className="about-page">
      <Navbar />

      <div className="about-content">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-text">
                <h1 className="hero-title">About the Artist</h1>
                <p className="hero-subtitle">
                  Discover the story behind the brushstrokes and the passion that fuels every creation.
                </p>
              </div>
              <div className="hero-image">
                <div className="artist-image-container">
                  <img
                    src="/bipana.jpg"
                    alt="Bipana - Artist"
                    className="artist-image"
                  />
                  <div className="artist-image-overlay">
                    <div className="overlay-content">
                      <h3>Bipana</h3>
                      <p>Artist & Creator</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <div className="container">
            <div className="story-grid">
              <div className="story-content">
                <h2>My Artistic Journey</h2>
                <div className="story-text">
                  <p>
                    Welcome to my world of colors, textures, and emotions. I'm Bipana, an artist
                    passionate about capturing the beauty of nature and the essence of human
                    experience through my paintings.
                  </p>
                  <p>
                    My journey began as a child, fascinated by the way light dances on surfaces
                    and how colors can evoke deep emotions. Over the years, I've developed a
                    unique style that blends traditional techniques with contemporary expressions,
                    creating artworks that speak to the soul.
                  </p>
                  <p>
                    Each piece I create is a reflection of my connection with the world around me -
                    from the majestic mountains that inspire awe to the quiet moments of everyday
                    life that deserve celebration.
                  </p>
                </div>

                <div className="artistic-philosophy">
                  <h3>Artistic Philosophy</h3>
                  <p>
                    I believe that art should not only be visually appealing but also emotionally
                    resonant. My work aims to create a dialogue between the viewer and the artwork,
                    inviting personal interpretations and emotional connections.
                  </p>
                </div>
              </div>

              <div className="quick-facts">
                <div className="facts-card">
                  <h3>Quick Facts</h3>
                  <div className="fact-item">
                    <span className="fact-label">Medium</span>
                    <span className="fact-value">Acrylic, Oil, Watercolor</span>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">Style</span>
                    <span className="fact-value">Contemporary Landscape & Abstract</span>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">Experience</span>
                    <span className="fact-value">5+ Years</span>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">Location</span>
                    <span className="fact-value">Based in Nuremberg</span>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">Education</span>
                    <span className="fact-value">Bachelor in Management</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inspiration Section */}
        <section className="inspiration-section">
          <div className="container">
            <h2>My Inspiration</h2>
            <div className="inspiration-grid">
              <div className="inspiration-item">
                <div className="inspiration-icon">🏔️</div>
                <h4>Nature's Majesty</h4>
                <p>The grandeur of mountains, the serenity of forests, and the ever-changing skies</p>
              </div>
              <div className="inspiration-item">
                <div className="inspiration-icon">🎨</div>
                <h4>Color & Light</h4>
                <p>The interplay of colors and how light transforms ordinary scenes into extraordinary moments</p>
              </div>
              <div className="inspiration-item">
                <div className="inspiration-icon">💫</div>
                <h4>Emotional Depth</h4>
                <p>Capturing the intangible feelings and memories that shape our human experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Let's Create Something Beautiful Together</h2>
              <p>Whether you're interested in purchasing existing artwork or commissioning a custom piece, I'd love to hear from you.</p>
              <div className="cta-buttons">
                <Link to="/gallery" className="btn btn-primary">View My Gallery</Link>
                <Link to="/contact" className="btn btn-tertiary">Get In Touch</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;