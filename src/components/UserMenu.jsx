// src/components/UserMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserMenu.css';

const UserMenu = ({ user, onLogout, onCloseMenu }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        onLogout();
        closeDropdown();
    };

    const getInitials = (displayName) => {
        if (!displayName) return '?';
        return displayName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="user-menu-container" ref={dropdownRef}>
            <button
                className="user-avatar-btn"
                onClick={toggleDropdown}
                aria-label="User menu"
                aria-expanded={isDropdownOpen}
            >
                <div className="user-avatar">
                    <span className="avatar-initials">
                        {getInitials(user.displayName)}
                    </span>
                </div>
                <span className="user-name">
                    {user.displayName || 'User'}
                </span>
                <span className="dropdown-arrow">▼</span>
            </button>

            {isDropdownOpen && (
                <div className="user-dropdown">
                    <div className="dropdown-header">
                        <div className="dropdown-avatar">
                            <span className="dropdown-initials">
                                {getInitials(user.displayName)}
                            </span>
                        </div>
                        <div className="dropdown-user-info">
                            <h4>{user.displayName || 'User'}</h4>
                            <p>{user.email}</p>
                        </div>
                    </div>

                    <Link
                        to="/profile"
                        className="dropdown-item"
                        onClick={() => {
                            closeDropdown();
                            onCloseMenu();
                        }}
                    >
                        👤 My Profile
                    </Link>

                    {/* <Link
                        to="/collections"
                        className="dropdown-item"
                        onClick={() => {
                            closeDropdown();
                            onCloseMenu();
                        }}
                    >
                        💖 My Collections
                    </Link>

                    <Link
                        to="/favorites"
                        className="dropdown-item"
                        onClick={() => {
                            closeDropdown();
                            onCloseMenu();
                        }}
                    >
                        ⭐ Favorites
                    </Link>

                    <Link
                        to="/comments"
                        className="dropdown-item"
                        onClick={() => {
                            closeDropdown();
                            onCloseMenu();
                        }}
                    >
                        💬 My Comments
                    </Link> */}

                    <div className="dropdown-divider"></div>

                    <button
                        className="dropdown-item logout-btn"
                        onClick={handleLogout}
                    >
                        👋 Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;