// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import Homepage from './components/Homepage';
import GalleryPage from './components/GalleryPage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Header */}
        <nav className="app-nav">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <h1>BipanasBrushwork</h1>
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/gallery" className="nav-link">Gallery</Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;