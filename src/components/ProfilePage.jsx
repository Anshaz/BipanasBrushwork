// src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import './ProfilePage.css';
import { 
  getLikesByUser,
  getCommentsByUser,
  getLikeCount,
  getComments 
} from '../services/artworkInteraction';
import artworks from '../data/artworks';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('collections');
  const [userLikes, setUserLikes] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedArtworks, setLikedArtworks] = useState([]);
  const [commentedArtworks, setCommentedArtworks] = useState([]);

  // useEffect(() => {
  //   if (currentUser) {
  //     loadUserData();
  //   }
  // }, [currentUser]);

  // const loadUserData = async () => {
  //   setIsLoading(true);
  //   try {
  //     // Load user's likes
  //     const likes = await getLikesByUser(currentUser.uid);
  //     setUserLikes(likes);
      
  //     // Load user's comments
  //     const comments = await getCommentsByUser(currentUser.uid);
  //     setUserComments(comments);
      
  //     // Map likes to artworks
  //     const likedArtworkData = [];
  //     for (const like of likes) {
  //       const artwork = artworks.find(art => art.id === like.artworkId);
  //       if (artwork) {
  //         const likeCount = await getLikeCount(artwork.id);
  //         const comments = await getComments(artwork.id);
  //         likedArtworkData.push({
  //           ...artwork,
  //           likeCount,
  //           commentCount: comments.length,
  //           likedAt: like.createdAt
  //         });
  //       }
  //     }
  //     setLikedArtworks(likedArtworkData);
      
  //     // Map comments to artworks
  //     const commentedArtworkData = [];
  //     for (const comment of comments) {
  //       const artwork = artworks.find(art => art.id === comment.artworkId);
  //       if (artwork) {
  //         const likeCount = await getLikeCount(artwork.id);
  //         const comments = await getComments(artwork.id);
  //         commentedArtworkData.push({
  //           ...artwork,
  //           commentData: comment,
  //           likeCount,
  //           commentCount: comments.length
  //         });
  //       }
  //     }
  //     setCommentedArtworks(commentedArtworkData);
      
  //   } catch (error) {
  //     console.error('Error loading user data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-unauthorized">
          <div className="unauthorized-container">
            <h2>🔒 Sign In Required</h2>
            <p>Please sign in to view your profile.</p>
            <a href="/" className="btn btn-primary">Go to Homepage</a>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userStats = {
    likedArtworks: likedArtworks.length,
    totalComments: userComments.length,
    joinedDate: currentUser.metadata?.creationTime || new Date().toISOString()
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            <span className="avatar-initials-large">
              {getInitials(currentUser.displayName)}
            </span>
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">{currentUser.displayName || 'Art Lover'}</h1>
            <p className="profile-email">{currentUser.email}</p>
            <p className="profile-joined">
              Member since {formatDate(userStats.joinedDate)}
            </p>
            
            {/* <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{userStats.likedArtworks}</span>
                <span className="stat-label">Favorites</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{userStats.totalComments}</span>
                <span className="stat-label">Comments</span>
              </div>
            </div> */}
            
            <button onClick={handleLogout} className="btn-logout">
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            <span className="tab-icon">🎨</span>
            My Collections ({likedArtworks.length})
          </button>
          <button
            className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <span className="tab-icon">❤️</span>
            Favorites ({likedArtworks.length})
          </button>
          <button
            className={`profile-tab ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            <span className="tab-icon">💬</span>
            My Comments ({userComments.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your profile data...</p>
            </div>
          ) : (
            <>
              {/* My Collections Tab */}
              {activeTab === 'collections' && (
                <div className="tab-content">
                  {likedArtworks.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🎨</div>
                      <h3>No Collections Yet</h3>
                      <p>Start building your collection by liking artworks in the gallery!</p>
                      <a href="/gallery" className="btn btn-primary">Browse Gallery</a>
                    </div>
                  ) : (
                    <>
                      <h2 className="tab-title">My Art Collection</h2>
                      <div className="collection-grid">
                        {likedArtworks.map((artwork, index) => (
                          <div key={`collection-${artwork.id}-${index}`} className="collection-item">
                            <div className="collection-image">
                              <img src={artwork.image} alt={artwork.title} />
                              <div className="collection-overlay">
                                <span className="collection-date">
                                  Liked on {formatDate(artwork.likedAt)}
                                </span>
                              </div>
                            </div>
                            <div className="collection-info">
                              <h3>{artwork.title}</h3>
                              <p>{artwork.medium} • {artwork.year}</p>
                              <div className="collection-stats">
                                <span className="stat">❤️ {artwork.likeCount}</span>
                                <span className="stat">💬 {artwork.commentCount}</span>
                              </div>
                              <a href={`/gallery?artwork=${artwork.id}`} className="btn-view">
                                View Artwork
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Favorites Tab (same as collections but different layout) */}
              {activeTab === 'favorites' && (
                <div className="tab-content">
                  {likedArtworks.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">❤️</div>
                      <h3>No Favorites Yet</h3>
                      <p>Like artworks to add them to your favorites!</p>
                      <a href="/gallery" className="btn btn-primary">Discover Artworks</a>
                    </div>
                  ) : (
                    <>
                      <h2 className="tab-title">My Favorite Artworks</h2>
                      <div className="favorites-grid">
                        {likedArtworks.map((artwork, index) => (
                          <div key={`favorite-${artwork.id}-${index}`} className="favorite-card">
                            <img src={artwork.image} alt={artwork.title} />
                            <div className="favorite-content">
                              <h3>{artwork.title}</h3>
                              <p>{artwork.medium}</p>
                              <div className="favorite-meta">
                                <span className="meta-date">
                                  ❤️ Liked {formatDate(artwork.likedAt)}
                                </span>
                                <a 
                                  href={`/gallery?artwork=${artwork.id}`}
                                  className="btn-view-small"
                                >
                                  View
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* My Comments Tab */}
              {activeTab === 'comments' && (
                <div className="tab-content">
                  {userComments.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">💬</div>
                      <h3>No Comments Yet</h3>
                      <p>Share your thoughts on artworks in the gallery!</p>
                      <a href="/gallery" className="btn btn-primary">Explore Gallery</a>
                    </div>
                  ) : (
                    <>
                      <h2 className="tab-title">My Comments</h2>
                      <div className="comments-list">
                        {userComments.map(comment => {
                          const artwork = commentedArtworks.find(
                            art => art.id === comment.artworkId
                          );
                          return (
                            <div key={comment.id} className="comment-card">
                              <div className="comment-header">
                                <div className="comment-artwork">
                                  <img src={artwork?.image} alt={artwork?.title} />
                                  <div className="artwork-info">
                                    <h4>{artwork?.title || 'Unknown Artwork'}</h4>
                                    <p>{artwork?.medium || ''}</p>
                                  </div>
                                </div>
                                <span className="comment-date">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <div className="comment-content">
                                <p>{comment.content}</p>
                              </div>
                              <div className="comment-actions">
                                <a 
                                  href={`/gallery?artwork=${comment.artworkId}`}
                                  className="btn-view-comment"
                                >
                                  View Artwork
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;