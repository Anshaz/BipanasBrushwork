// src/App.js (update)
import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Homepage from './components/Homepage';
import GalleryPage from './components/GalleryPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import NotFound from './components/NotFound';

function App() {
  //   useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (!user) return;

  //     const ref = doc(db, "users", user.uid);
  //     const snap = await getDoc(ref);
  //     if (!snap.exists()) {
  //       await setDoc(ref, {
  //         uid: user.uid,
  //         email: user.email,
  //         createdAt: serverTimestamp()
  //       });
  //     }
  //   });

  //   return () => unsubscribe(); // cleanup
  // }, []);
  return (
    <Router>
        <div className="App">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
              {/* <Route path="/profile" element={<ProfilePage />} /> */}
            </Routes>
          </main>
        </div>
    </Router>
  );
}

export default App;