import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast({ toast, onClose }) {
  if (!toast || !toast.message) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className={`toast-container animate-fade-in ${toast.type}`}>
      <div className="toast-icon">
        {isSuccess && <CheckCircle2 size={18} className="toast-icon-svg success" />}
        {isError && <AlertCircle size={18} className="toast-icon-svg error" />}
        {!isSuccess && !isError && <Info size={18} className="toast-icon-svg info" />}
      </div>

      <div className="toast-message">
        <p className="toast-text">{toast.message}</p>
      </div>

      <button
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
