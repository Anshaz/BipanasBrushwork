// src/App.js (update)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // NEW
import './index.css';
import Homepage from './components/Homepage';
import GalleryPage from './components/GalleryPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider> {/* NEW: Wrap with AuthProvider */}
        <div className="App">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;