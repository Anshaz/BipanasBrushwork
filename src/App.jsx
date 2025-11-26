// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Homepage from './components/Homepage';
import GalleryPage from './components/GalleryPage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation is now handled within each page component */}
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