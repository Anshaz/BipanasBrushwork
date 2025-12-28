// src/components/AuthModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          throw new Error('Please enter a display name');
        }
        await signup(email, password, displayName);
      }
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Join the Art Community'}</h2>
          <p>{isLogin ? 'Sign in to comment and save favorites' : 'Create an account to get started'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Display Name *</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we call you?"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <button 
          className="btn btn-google"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" />
          Continue with Google
        </button>

        <div className="auth-footer">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button 
                type="button" 
                className="link-btn"
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                type="button" 
                className="link-btn"
                onClick={() => setIsLogin(true)}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;