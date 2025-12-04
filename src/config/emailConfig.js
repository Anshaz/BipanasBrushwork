// src/config/emailConfig.js (recommended path - update import accordingly)
const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  
  validateConfig: function() {
    const missing = [];
    
    if (!this.serviceId) missing.push('VITE_EMAILJS_SERVICE_ID');
    if (!this.templateId) missing.push('VITE_EMAILJS_TEMPLATE_ID');
    if (!this.publicKey) missing.push('VITE_EMAILJS_PUBLIC_KEY');
    
    if (missing.length > 0) {
      console.warn(`⚠️ EmailJS configuration missing: ${missing.join(', ')}`);
      console.warn('Please check your .env.local file or environment variables.');
      return false;
    }
    
    return true;
  },
  
  getSafeConfig: function() {
    return {
      serviceId: this.serviceId ? '✓ Configured' : '✗ Missing',
      templateId: this.templateId ? '✓ Configured' : '✗ Missing',
      publicKey: this.publicKey ? '✓ Configured' : '✗ Missing',
      isProduction: import.meta.env.PROD,
    };
  }
};

export default emailConfig;