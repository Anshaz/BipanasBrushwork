// src/components/ImageZoomModal.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getComments,
  addComment,
  deleteComment,
  getLikeCount,
  checkUserLike,
  likeArtwork
} from '../services/artworkInteraction';
import './ImageZoomModal.css';

const ImageZoomModal = ({
  artwork,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('image'); // 'image' or 'comments'
  const { currentUser } = useAuth();

  useEffect(() => {
    // Reset when artwork changes
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setImageLoaded(false);
    setNewComment('');
    loadComments();
    loadLikeInfo();
    setActiveTab('image');
  }, [artwork]);

  const loadComments = async () => {
    const commentsList = await getComments(artwork.id);
    setComments(commentsList);
  };

  const loadLikeInfo = async () => {
    const count = await getLikeCount(artwork.id);
    setLikeCount(count);

    if (currentUser) {
      const liked = await checkUserLike(artwork.id, currentUser.uid);
      setUserLiked(liked);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert('Please sign in to like artworks');
      return;
    }

    try {
      const result = await likeArtwork(artwork.id, currentUser.uid);
      if (result.liked) {
        setLikeCount(prev => prev + 1);
        setUserLiked(true);
      } else {
        setLikeCount(prev => prev - 1);
        setUserLiked(false);
      }
    } catch (error) {
      console.error('Error liking artwork:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const comment = await addComment(
        artwork.id,
        currentUser.uid,
        currentUser.displayName || 'Anonymous',
        newComment.trim()
      );

      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return;

    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment(commentId, currentUser.uid);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(error.message || 'Failed to delete comment');
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(3, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(3, prev + 0.25));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(0.5, prev - 0.25));
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <button
              className={`modal-tab ${activeTab === 'image' ? 'active' : ''}`}
              onClick={() => setActiveTab('image')}
            >
              Artwork
            </button>
            <button
              className={`modal-tab ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Comments ({comments.length})
            </button>
            <button
              className={`like-btn-header ${userLiked ? 'liked' : ''}`}
              onClick={handleLike}
              title={currentUser ? 'Like this artwork' : 'Sign in to like'}
            >
              ❤️ {likeCount}
            </button>
          </div>

          <div className="modal-header-right">
            <button onClick={onClose} className="close-btn">
              ×
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="modal-body">
          {/* Image Tab */}
          {activeTab === 'image' && (
            <div className="image-tab">
              <div className="image-container">
                {!imageLoaded && (
                  <div className="image-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading image...</p>
                  </div>
                )}

                <div
                  className="image-wrapper"
                  onWheel={handleWheel}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ cursor: zoomLevel > 1 ? 'grab' : 'default' }}
                >
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className={`zoom-image ${imageLoaded ? 'loaded' : ''}`}
                    style={{
                      transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                      cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                    }}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>

                {/* Navigation Arrows */}
                {hasPrev && (
                  <button
                    onClick={onPrev}
                    className="nav-arrow nav-arrow-prev"
                    aria-label="Previous artwork"
                  >
                    ‹
                  </button>
                )}
                {hasNext && (
                  <button
                    onClick={onNext}
                    className="nav-arrow nav-arrow-next"
                    aria-label="Next artwork"
                  >
                    ›
                  </button>
                )}
              </div>

              {/* Artwork Info below image on mobile */}
              <div className="artwork-info-mobile">
                <h3 className="artwork-title">{artwork.title}</h3>
                <p className="artwork-medium">{artwork.medium} • {artwork.year}</p>
                {artwork.dimensions && (
                  <p className="artwork-dimensions">{artwork.dimensions}</p>
                )}
                {artwork.price && (
                  <p className="artwork-price">${artwork.price}</p>
                )}

                {artwork.onEtsy && artwork.etsyLink ? (
                  <div className="etsy-link-modal-mobile">
                    <a
                      href={artwork.etsyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="etsy-link-text"
                    >
                      Buy on Etsy
                    </a>
                  </div>
                ) : (
                  <p className="not-on-etsy-text">
                    Available on request. <a href="/contact" className="contact-link">Contact me</a>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="comments-tab">
              <div className="comments-header">
                <h3>Comments ({comments.length})</h3>
              </div>

              {/* Add Comment Form */}
              <div className="add-comment-section">
                {currentUser ? (
                  <form className="add-comment-form" onSubmit={handleSubmitComment}>
                    <textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows="3"
                      disabled={isSubmitting}
                      className="comment-textarea"
                    />
                    <div className="comment-form-actions">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setNewComment('')}
                        disabled={isSubmitting || !newComment.trim()}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || !newComment.trim()}
                      >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="login-prompt">
                    <p>
                      <button
                        className="link-btn"
                        onClick={() => {
                          // You might want to trigger auth modal here
                          alert('Please sign in to comment');
                        }}
                      >
                        Sign in
                      </button> to add a comment
                    </p>
                  </div>
                )}
              </div>

              {/* Comments List */}
              <div className="comments-list">
                {comments.length === 0 ? (
                  <div className="no-comments">
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-author-info">
                          <span className="comment-author">{comment.userName}</span>
                          <span className="comment-date">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        {currentUser?.uid === comment.userId && (
                          <button
                            className="delete-comment-btn"
                            onClick={() => handleDeleteComment(comment.id)}
                            title="Delete comment"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageZoomModal;