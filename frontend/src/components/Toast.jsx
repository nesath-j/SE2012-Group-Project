import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useAuth();

  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '420px',
      pointerEvents: 'none',
    }}>
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: '#ffffff',
              border: `1.5px solid ${isSuccess ? '#10b981' : isError ? '#f43f5e' : '#0284c7'}`,
              borderRadius: '12px',
              padding: '0.875rem 1.15rem',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#0f172a',
              fontSize: '0.9rem',
              fontWeight: 500,
              animation: 'fadeIn 0.25s ease-out forwards',
            }}
          >
            {isSuccess && <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0 }} />}
            {isError && <AlertCircle size={20} color="#f43f5e" style={{ flexShrink: 0 }} />}
            {!isSuccess && !isError && <Info size={20} color="#0284c7" style={{ flexShrink: 0 }} />}
            <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: '#94a3b8',
                display: 'inline-flex',
                padding: '2px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
