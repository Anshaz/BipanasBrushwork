// src/components/ContactPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <div className="contact-content">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Get In Touch</h1>
              <p className="hero-subtitle">
                I'd love to hear from you! Whether you're interested in purchasing artwork, 
                discussing a commission, or just want to say hello.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="container">
            <div className="contact-grid">
              {/* Contact Form */}
              <div className="contact-form-container">
                <h2>Send a Message</h2>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="">Select a subject</option>
                      <option value="purchase">Purchase Inquiry</option>
                      <option value="commission">Commission Request</option>
                      <option value="exhibition">Exhibition Opportunity</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary submit-btn">
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="contact-info">
                <h2>Contact Information</h2>
                <div className="info-card">
                  <div className="info-item">
                    <div className="info-icon">📧</div>
                    <div className="info-content">
                      <h4>Email</h4>
                      <p>your-email@example.com</p>
                      <span>I'll respond within 24 hours</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-icon">📱</div>
                    <div className="info-content">
                      <h4>Phone</h4>
                      <p>+1 (555) 123-4567</p>
                      <span>Available 10AM - 6PM</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-icon">📍</div>
                    <div className="info-content">
                      <h4>Studio Location</h4>
                      <p>123 Art Street</p>
                      <p>Creative City, CC 12345</p>
                      <span>Visits by appointment only</span>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="faq-section">
                  <h3>Frequently Asked Questions</h3>
                  <div className="faq-item">
                    <h4>Do you accept commissions?</h4>
                    <p>Yes! I love working on custom pieces. Contact me to discuss your vision and requirements.</p>
                  </div>
                  <div className="faq-item">
                    <h4>What's your shipping policy?</h4>
                    <p>I ship worldwide with careful packaging. Shipping costs vary by location and artwork size.</p>
                  </div>
                  <div className="faq-item">
                    <h4>Can I visit your studio?</h4>
                    <p>Studio visits are welcome by appointment. Please contact me to schedule a visit.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Links Section */}
        <section className="social-section">
          <div className="container">
            <div className="social-content">
              <h2>Follow My Journey</h2>
              <p>Stay updated with my latest artworks and behind-the-scenes moments.</p>
              <div className="social-links">
                <a href="#" className="social-link instagram">
                  <span>Instagram</span>
                </a>
                <a href="#" className="social-link facebook">
                  <span>Facebook</span>
                </a>
                <a href="#" className="social-link twitter">
                  <span>Twitter</span>
                </a>
                <a href="#" className="social-link pinterest">
                  <span>Pinterest</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;