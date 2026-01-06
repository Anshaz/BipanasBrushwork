// src/components/Navbar.jsx (update)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu'; // We'll create this next
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-text">Bipana's Brushwork</span>
          </Link>
          
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
            <Link to="/gallery" className="nav-link" onClick={closeMenu}>Gallery</Link>
            <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
            <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>
            {/* <Link to="/profile" className="nav-link" onClick={closeMenu}>Profile</Link> */}

            {/* User/Auth Section */}
            {/* <div className="user-section">
              {currentUser ? (
                <UserMenu 
                  user={currentUser} 
                  onLogout={handleLogout}
                  onCloseMenu={closeMenu}
                />
              ) : (
                <button 
                  className="nav-link auth-btn"
                  onClick={() => {
                    setShowAuthModal(true);
                    closeMenu();
                  }}
                >
                  Sign In
                </button>
              )}
            </div> */}
          </div>

          <button 
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Navbar;