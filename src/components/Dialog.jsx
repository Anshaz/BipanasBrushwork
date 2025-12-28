// src/components/Dialog.jsx
import React from 'react';
import './Dialog.css';

const Dialog = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', 
  confirmText = 'OK',
  onConfirm,
  cancelText = 'Cancel',
  onCancel,
  showCancel = false
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const icon = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅',
    login: '🔐'
  }[type] || 'ℹ️';

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div className="dialog">
        <button className="dialog-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <div className="dialog-header">
          <span className="dialog-icon">{icon}</span>
          <h3 className="dialog-title">{title}</h3>
        </div>
        
        <div className="dialog-body">
          <p className="dialog-message">{message}</p>
        </div>
        
        <div className="dialog-footer">
          {showCancel && (
            <button 
              className="dialog-btn dialog-btn-cancel"
              onClick={handleCancel}
            >
              {cancelText}
            </button>
          )}
          <button 
            className={`dialog-btn dialog-btn-confirm dialog-btn-${type}`}
            onClick={handleConfirm}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;