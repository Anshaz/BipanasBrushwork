// src/components/Navbar.jsx (updated with useEffect)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
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
    );
};

export default Navbar;