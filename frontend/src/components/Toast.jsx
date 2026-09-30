import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={20} className="toast-icon-success" />,
    error: <AlertCircle size={20} className="toast-icon-error" />,
    info: <Info size={20} className="toast-icon-info" />
  };

  return (
    <div className={`toast-container toast-${toast.type || 'info'} animate-fade-in`}>
      <div className="toast-content">
        {icons[toast.type || 'info']}
        <div className="toast-body">
          {toast.title && <div className="toast-title">{toast.title}</div>}
          <div className="toast-message">{toast.message}</div>
        </div>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
}
