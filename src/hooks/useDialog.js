// src/hooks/useDialog.js
import { useState } from 'react';

const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    onCancel: null,
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: false
  });

  const showDialog = (dialogConfig) => {
    setConfig({
      ...config,
      ...dialogConfig
    });
    setIsOpen(true);
  };

  const hideDialog = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    hideDialog();
  };

  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel();
    }
    hideDialog();
  };

  return {
    isOpen,
    config,
    showDialog,
    hideDialog,
    handleConfirm,
    handleCancel
  };
};

export default useDialog;