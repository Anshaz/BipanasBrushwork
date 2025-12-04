// src/components/ContactPage.jsx
import React, { useState, useRef, useEffect } from 'react'; // Added useEffect import
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Navbar from './Navbar';
import './ContactPage.css';
import emailConfig from '../config/emailConfig'; // Check if this path is correct

const ContactPage = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isEmailConfigured, setIsEmailConfigured] = useState(true);

  // Check if email is configured on mount
  useEffect(() => {
    const isConfigured = emailConfig.validateConfig();
    setIsEmailConfigured(isConfigured);

    if (!isConfigured) {
      console.error('❌ EmailJS not configured. Contact form will not work.');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmailConfigured) {
      setSubmitStatus({
        type: 'error',
        message: 'Contact form is temporarily unavailable. Please email me directly at your-email@gmail.com'
      });
      return;
    }
    // Basic form validation
    const formData = new FormData(form.current);
    const name = formData.get('user_name');
    const email = formData.get('user_email');
    const message = formData.get('message');

    if (!name || !email || !message) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all required fields.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    // Add current date to form data
    const currentDate = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Send email using EmailJS
    emailjs.sendForm(
      emailConfig.serviceId,
      emailConfig.templateId,
      form.current,
      emailConfig.publicKey,
      {
        date: currentDate
      }
    )
      .then((result) => {
        console.log('✅ Email sent successfully:', result.text);
        setSubmitStatus({
          type: 'success',
          message: '🎉 Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.'
        });
        // Reset form
        form.current.reset();
      })
      .catch((error) => {
        console.error('❌ Email send failed:', error.text || error);
        setSubmitStatus({
          type: 'error',
          message: `Oops! Something went wrong. Please try again or contact me directly at https://www.etsy.com/de-en/shop/Bipanasbrushwork`
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="contact-page">
      <Navbar />

      <div className="contact-content">
        <section className="contact-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Get In Touch</h1>
              <p className="hero-subtitle">
                I'd love to hear from you! Send me a message and I'll respond within 24 hours.
              </p>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <div className="container">
            <div className="contact-grid">
              {/* Contact Form */}
              <div className="contact-form-container">
                <h2>Send a Message</h2>

                {submitStatus.message && (
                  <div className={`submit-message ${submitStatus.type}`}>
                    {submitStatus.message}
                  </div>
                )}

                <form
                  ref={form}
                  className="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="user_name"
                      required
                      disabled={isSubmitting}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="user_email"
                      required
                      disabled={isSubmitting}
                      placeholder="Your email address"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      disabled={isSubmitting}
                      defaultValue=""
                    >
                      <option value="">Select a subject</option>
                      <option value="Purchase Inquiry">Purchase Inquiry</option>
                      <option value="Commission Request">Commission Request</option>
                      <option value="Exhibition Opportunity">Exhibition Opportunity</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="General Question">General Question</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      required
                      disabled={isSubmitting}
                      placeholder="Your message here..."
                    ></textarea>
                  </div>

                  <div className="form-submit-info">
                    <p className="required-note">* Required fields</p>
                    <button
                      type="submit"
                      className="btn btn-primary submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner"></span>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;